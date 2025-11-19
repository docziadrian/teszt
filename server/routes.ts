import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({
          message: validationError.message,
          errors: validationResult.error.errors,
        });
      }

      const contactMessage = await storage.createContactMessage(validationResult.data);
      
      return res.status(201).json({
        message: "Üzenet sikeresen elküldve!",
        data: contactMessage,
      });
    } catch (error) {
      console.error("Error creating contact message:", error);
      return res.status(500).json({
        message: "Hiba történt az üzenet küldése során. Kérjük, próbáld újra később.",
      });
    }
  });

  // Get all contact messages (for admin purposes - could be protected)
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({
        message: "Hiba történt az üzenetek lekérdezése során.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
