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
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser()) // Pipe the file stream into csv-parser
      .on("data", (row) => {
        results.push(row); // Store each parsed row
      })
      .on("end", async () => {
        console.log("CSV file parsed:", results);

        const newIngredients = [];

        // Loop through each row and insert data into the database
        for (let row of results) {
          const { id, name, source, price, unit } = row;
          const numPrice = parseFloat(price);

          // Save the parsed data into your Prisma database
          if (id === "") {
            const newIngredient = await prisma.ingredient.create({
              data: {
                name: name,
                source: source,
                price: numPrice, // Cast 'price' to float
                unit: unit,
              },
            });
            newIngredients.push(newIngredient);
          } else {
            const existingIngredient = await prisma.ingredient.findUnique({
              where: { id: Number(id) }, // Cast 'id' to a number
            });
            if (existingIngredient) {
              // If the ingredient already exists, update it
              await prisma.ingredient.update({
                where: { id: Number(id) }, // Cast 'id' to a number
                data: {
                  name: name,
                  source: source,
                  price: numPrice, // Cast 'price' to float
                  unit: unit,
                },
              });
              newIngredients.push(existingIngredient);
            } else {
              const newIngredient = await prisma.ingredient.create({
                data: {
                  id: Number(id), // Cast 'id' to number
                  name: name,
                  source: source,
                  price: numPrice, // Cast 'price' to float
                  unit: unit,
                },
              });
              newIngredients.push(newIngredient);
            }
          }

          console.log("New Ingredient created:", newIngredients);
        }

        return new Response(
          JSON.stringify({
            message: "Ingredient created successfully",
            ingredient: newIngredients,
          })
        );
      })
      .on("error", (err) => {
        console.error("Error parsing CSV:", err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
        });
      });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Unable to create ingredient",
        error: error.message,
      })
    );
  }
}
