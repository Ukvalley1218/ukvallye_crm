import cloudinary from "../config/cloudinary.js";
import CheckInOut from "../models/CheckInOut.js";
import { getDistance } from "geolib";
import {
  OFFICE_LOCATION,
  MAX_DISTANCE_METERS,
} from "../config/officeConfig.js";
import { calculateDistance } from "../utils/calcDistance.js";

// const OFFICE_LOCATION = {
//   latitude: 19.9870221, // Example Mumbai
//   longitude: 73.7899521,
// };

// export const checkInOut = async (req, res, next) => {
//   try {
//     const { type, latitude, longitude } = req.body;
//     const userId = req.user.id;

//     if (!req.file) {
//       return res.status(400).json({ message: "Selfie is required" });
//     }

//     // Upload selfie
//     // const selfieUrl = await new Promise((resolve, reject) => {
//     //   const stream = cloudinary.uploader.upload_stream(
//     //     { folder: "checkin-out" },
//     //     (error, result) => {
//     //       if (error) reject(error);
//     //       else resolve(result.secure_url);
//     //     }
//     //   );
//     //   stream.end(req.file.buffer);
//     // });

//     // Date key (YYYY-MM-DD)
//     const today = new Date().toISOString().split("T")[0];

//     // Distance from office
//     const distance = getDistance(
//       { latitude, longitude },
//       OFFICE_LOCATION
//     );

//     let record;

//     if (type === "checkin") {
//       // Create or update check-in record for today
//       record = await CheckInOut.findOne({ user: userId, date: today });

//       if (record && record.checkInTime) {
//         return res.status(400).json({ message: "Already checked in today" });
//       }

//       record = await CheckInOut.create({
//         user: userId,
//         type: "checkin",
//         date: today,
//         checkInTime: new Date(),
//         // selfieUrl,
//         location: { latitude, longitude },
//         officeLocation: OFFICE_LOCATION,
//         distanceFromOffice: distance,
//       });
//     }

//     if (type === "checkout") {
//       // Must exist before checkout
//       record = await CheckInOut.findOne({ user: userId, date: today });

//       if (!record) {
//         return res.status(400).json({ message: "No check-in found for today" });
//       }

//       if (record.checkOutTime) {
//         return res.status(400).json({ message: "Already checked out today" });
//       }

//       record.checkOutTime = new Date();
//       record.type = "checkout";
//     //   record.selfieUrl = selfieUrl;
//       record.location = { latitude, longitude };
//       record.distanceFromOffice = distance;

//       await record.save();
//     }

//     res.status(201).json({
//       message: `User ${type} successful`,
//       record,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const checkInOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, latitude, longitude, selfieUrl } = req.body;

    if (!type || !["checkin", "checkout"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'checkin' or 'checkout'" });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location required" });
    }

    // Distance validation
    const distance = calculateDistance(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    if (distance > MAX_DISTANCE_METERS) {
      return res.status(403).json({
        message: `${type} failed. You are ${Math.round(distance)}m away from office`,
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (type === "checkin") {
      // Check if there's an open session (checked in but not checked out)
      const active = await CheckInOut.findOne({
        user: userId,
        date: today,
        checkOutTime: null,
      });

      if (active) {
        return res.status(400).json({ message: "Already checked in, please checkout first" });
      }

      const record = await CheckInOut.create({
        user: userId,
        type: "checkin",
        date: today,
        checkInTime: new Date(),
        selfieUrl,
        location: { latitude, longitude },
        officeLocation: {
          latitude: OFFICE_LOCATION.lat,
          longitude: OFFICE_LOCATION.lng,
        },
        distanceFromOffice: distance,
      });

      return res.json({ message: "Checked in successfully", record });
    }

    if (type === "checkout") {
      // Find latest open checkin
      const record = await CheckInOut.findOne({
        user: userId,
        date: today,
        checkOutTime: null,
      }).sort({ createdAt: -1 });

      if (!record) {
        return res.status(400).json({ message: "No active check-in found to checkout" });
      }

      record.checkOutTime = new Date();
      record.type = "checkout";
      record.selfieUrl = selfieUrl;
      record.location = { latitude, longitude };
      record.officeLocation = {
        latitude: OFFICE_LOCATION.lat,
        longitude: OFFICE_LOCATION.lng,
      };
      record.distanceFromOffice = distance;

      await record.save();
      return res.json({ message: "Checked out successfully", record });
    }
  } catch (err) {
    next(err);
  }
};


export const getMyCheckIns = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const records = await CheckInOut.find({ user: userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

// Attendance Summary (monthly)
export const getAttendanceSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    // Default to current month/year
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth(); // JS month is 0-based
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const records = await CheckInOut.find({
      user: userId,
      date: {
        $gte: startDate.toISOString().split("T")[0],
        $lte: endDate.toISOString().split("T")[0],
      },
    });

    let totalDays = 0;
    let lateCheckIns = 0;
    let totalHours = 0;

    records.forEach((rec) => {
      totalDays++;

      // Example: office start time = 9:30 AM
      const officeStart = new Date(`${rec.date}T09:30:00Z`);
      if (rec.checkInTime && new Date(rec.checkInTime) > officeStart) {
        lateCheckIns++;
      }

      // Calculate working hours
      if (rec.checkInTime && rec.checkOutTime) {
        const diff =
          (new Date(rec.checkOutTime) - new Date(rec.checkInTime)) /
          (1000 * 60 * 60);
        totalHours += diff;
      }
    });

    res.json({
      month: targetMonth + 1,
      year: targetYear,
      totalDays,
      lateCheckIns,
      totalHours: totalHours.toFixed(2),
      records,
    });
  } catch (err) {
    next(err);
  }
};

// ---- Check In ----
export const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, selfieUrl } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location required" });
    }

    // Distance validation
    const distance = calculateDistance(
      latitude,
      longitude,
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng
    );
    if (distance > MAX_DISTANCE_METERS) {
      return res.status(403).json({
        message: `Check-in failed. You are ${Math.round(
          distance
        )}m away from office`,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const existing = await CheckInOut.findOne({ user: userId, date: today });
    if (existing && existing.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const record = await CheckInOut.create({
      user: userId,
      type: "checkin", // required field
      date: today,
      checkInTime: new Date(),
      selfieUrl,
      location: { latitude, longitude }, // matches schema
      officeLocation: {
        // required field
        latitude: OFFICE_LOCATION.lat,
        longitude: OFFICE_LOCATION.lng,
      },
      distanceFromOffice: distance,
    });

    res.json({ message: "Checked in successfully", record });
  } catch (err) {
    next(err);
  }
};

// ---- Check Out ----
export const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id; // use .id if your middleware attaches { id }, not _id
    const { latitude, longitude, selfieUrl } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location required" });
    }

    // Distance validation
    const distance = calculateDistance(
      latitude,
      longitude,
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng
    );
    if (distance > MAX_DISTANCE_METERS) {
      return res.status(403).json({
        message: `Check-out failed. You are ${Math.round(
          distance
        )}m away from office`,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const record = await CheckInOut.findOne({ user: userId, date: today });

    if (!record || record.checkOutTime) {
      return res
        .status(400)
        .json({ message: "No active check-in record found" });
    }

    // ✅ update according to schema
    record.checkOutTime = new Date();
    record.type = "checkout"; // schema requires type
    record.selfieUrl = selfieUrl; // reuse same selfieUrl field
    record.location = { latitude, longitude }; // matches schema
    record.officeLocation = {
      latitude: OFFICE_LOCATION.lat,
      longitude: OFFICE_LOCATION.lng,
    };
    record.distanceFromOffice = distance;

    await record.save();

    res.json({ message: "Checked out successfully", record });
  } catch (err) {
    next(err);
  }
};

// combine chekin and checkout controllers into one
// export const checkInOut = async (req, res, next) => {
//   try {
//     const userId = req.user.id; // or req.user._id depending on your middleware
//     const { type, latitude, longitude, selfieUrl } = req.body;

//     if (!type || !["checkin", "checkout"].includes(type)) {
//       return res.status(400).json({ message: "Invalid type. Must be 'checkin' or 'checkout'" });
//     }

//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: "Location required" });
//     }

//     // Distance validation
//     const distance = calculateDistance(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
//     if (distance > MAX_DISTANCE_METERS) {
//       return res
//         .status(403)
//         .json({ message: `${type} failed. You are ${Math.round(distance)}m away from office` });
//     }

//     const today = new Date().toISOString().split("T")[0];
//     let record = await CheckInOut.findOne({ user: userId, date: today });

//     // ✅ Handle Check-In
//     if (type === "checkin") {
//       if (record && record.checkInTime) {
//         return res.status(400).json({ message: "Already checked in today" });
//       }

//       record = await CheckInOut.create({
//         user: userId,
//         type: "checkin",
//         date: today,
//         checkInTime: new Date(),
//         selfieUrl,
//         location: { latitude, longitude },
//         officeLocation: {
//           latitude: OFFICE_LOCATION.lat,
//           longitude: OFFICE_LOCATION.lng,
//         },
//         distanceFromOffice: distance,
//       });

//       return res.json({ message: "Checked in successfully", record });
//     }

//     // ✅ Handle Check-Out
//     if (type === "checkout") {
//       if (!record || record.checkOutTime) {
//         return res.status(400).json({ message: "No active check-in record found" });
//       }

//       record.checkOutTime = new Date();
//       record.type = "checkout";
//       record.selfieUrl = selfieUrl;
//       record.location = { latitude, longitude };
//       record.officeLocation = {
//         latitude: OFFICE_LOCATION.lat,
//         longitude: OFFICE_LOCATION.lng,
//       };
//       record.distanceFromOffice = distance;

//       await record.save();
//       return res.json({ message: "Checked out successfully", record });
//     }
//   } catch (err) {
//     next(err);
//   }
// };
