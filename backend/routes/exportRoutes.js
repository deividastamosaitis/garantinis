import express from "express";
import { MongoClient } from "mongodb";
import ExcelJS from "exceljs";

// MongoDB connection details
const MONGO_URI =
  "mongodb+srv://wcoklet:admin123@gps.esrfsrw.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "test";
const COLLECTION_NAME = "jobs"; // Replace with your collection name

const router = express.Router();

// Export route
router.get("/export", async (req, res) => {
  const client = new MongoClient(MONGO_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    // Add column headers dynamically based on MongoDB document keys
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
      worksheet.columns = columns;

      // Add rows to worksheet
      worksheet.addRows(data);
    } else {
      worksheet.addRow(["No data available"]);
    }

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Error exporting data");
  } finally {
    await client.close();
  }
});

export { router as exportRoutes };
