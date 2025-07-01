import { PrismaClient } from "@prisma/client";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs";
import csvParser from "csv-parser"; // Import the csv-parser library

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

function formatWords(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function nextRequestToReadable(req) {
  const reader = req.body.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
}
export async function POST(req) {
  try {
    const stream = nextRequestToReadable(req);
    stream.headers = Object.fromEntries(req.headers);
    const form = new IncomingForm();

    const formData = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = formData.files.file[0];
    const filePath = file.filepath;

    const results = await new Promise((resolve, reject) => {
      const tempResults = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          tempResults.push(row);
        })
        .on("end", () => {
          resolve(tempResults);
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    const newIngredients = [];

    for (let row of results) {
      let { id, name, source, price, unit } = row;
      name = formatWords(name);
      source = formatWords(source);
      const numID = Number(id);
      const numPrice = parseFloat(price);

      if (id === "") {
        // Check if an ingredient with same name + source already exists
        const existingIngredient = await prisma.ingredient.findFirst({
          where: {
            name: name,
            source: source,
          },
        });

        if (existingIngredient) {
          // If it exists, UPDATE it
          const updatedIngredient = await prisma.ingredient.update({
            where: { id: existingIngredient.id },
            data: {
              price: numPrice,
              unit,
            },
          });
          newIngredients.push(updatedIngredient);
        } else {
          // Otherwise, CREATE a new one
          const newIngredient = await prisma.ingredient.create({
            data: {
              name,
              source,
              price: numPrice,
              unit,
            },
          });
          newIngredients.push(newIngredient);
        }
      } else {
        // id exists
        const existingIngredient = await prisma.ingredient.findUnique({
          where: { id: numID },
        });

        if (existingIngredient) {
          const updatedIngredient = await prisma.ingredient.update({
            where: { id: numID },
            data: {
              name,
              source,
              price: numPrice,
              unit,
            },
          });
          newIngredients.push(updatedIngredient);
        } else {
          const newIngredient = await prisma.ingredient.create({
            data: {
              id: numID,
              name,
              source,
              price: numPrice,
              unit,
            },
          });
          newIngredients.push(newIngredient);
        }
      }
    }

    const allIngredients = await prisma.ingredient.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return new Response(
      JSON.stringify({
        message: "Ingredients processed successfully",
        ingredients: allIngredients,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Unable to process ingredients",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
