const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { register } = require("module");
const fileUpload = require("express-fileupload");
const exceljs = require("exceljs");

dotenv.config();
app.use(fileUpload());
// const userController = require("./UserController");

app.post("/create", async (req, res, next) => {
  try {
    const result = await prisma.product.create({
      data: req.body,
    });

    res.send({ message: "Product has been saved" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/list", async (req, res, next) => {
  try {
    const result = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status: "use",
      },
    });
    res.send({ result: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/remove/:id", async (req, res, next) => {
  try {
    await prisma.product.update({
      data: {
        status: "delete",
      },
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.send({ message: "succes" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.put("/update/:id", async (req, res, next) => {
  try {
    const fs = require("fs");
    const oldData = await prisma.product.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    const imagePath = "/home/corn/course_fullstackXD/workshop/api/uploads/" + oldData.img;

    if (fs.existsSync(imagePath)) {
      await fs.unlinkSync(imagePath);
    }

    await prisma.product.update({
      data: req.body,
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.send({ message: "succes" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/upload", async (req, res, next) => {
  try {
    if (req.files !== undefined && req.files.img !== undefined) {
      const img = req.files.img;
      const fs = require("fs");
      const myDate = new Date();
      const y = myDate.getFullYear();
      const m = myDate.getMonth() + 1;
      const d = myDate.getDate();
      const h = myDate.getHours();
      const mi = myDate.getMinutes();
      const s = myDate.getSeconds();
      const ms = myDate.getMilliseconds();

      const arrFilename = img.name.split(".");
      const ext = arrFilename[arrFilename.length - 1];

      const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

      img.mv(
        "/home/corn/course_fullstackXD/workshop/api/uploads/" + newName,
        (err) => {
          if (err) {
            throw err;
          } else {
            res.send({ name: newName });
          }
        }
      );
    } else {
      res.status(501).send("not implemented");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/uploadFromExcel", async (req, res, next) => {
  try {
    const fileExcel = req.files.fileExcel;

    fileExcel.mv(
      "/home/corn/course_fullstackXD/workshop/api/uploads/" + fileExcel.name,
      async (err) => {
        if (err) {
          throw err;
        } else {
          const workbook = new exceljs.Workbook();
          await workbook.xlsx.readFile(
            "/home/corn/course_fullstackXD/workshop/api/uploads/" +
              fileExcel.name
          );

          const worksheet = workbook.getWorksheet(1);
          for (let i = 2; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const name = row.getCell(1).value ?? "";
            const cost = row.getCell(2).value ?? 0; 
            const price = row.getCell(3).value ?? 0;

            await prisma.product.create({
              data: {
                name: name,
                cost: cost,
                price: price,
                img: "",
              },
            });
          }
          const fs = require("fs");
          await fs.unlinkSync(
            "/home/corn/course_fullstackXD/workshop/api/uploads/" + fileExcel.name
          );
        }
      }
    );
    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
