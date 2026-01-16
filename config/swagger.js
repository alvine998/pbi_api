const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PBI API Documentation",
      version: "1.0.0",
      description: "API documentation for PBI Dashboard application",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", default: "User" },
            status: { type: "string", default: "Active" },
            phone: { type: "string" },
            avatar: { type: "string" },
            lastLogin: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            description: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Aspiration: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userName: { type: "string" },
            category: { type: "string" },
            content: { type: "string" },
            status: { type: "string", default: "Pending" },
            date: { type: "string", format: "date" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        News: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            category: { type: "string" },
            content: { type: "string" },
            status: { type: "string", default: "Published" },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Poll: {
          type: "object",
          properties: {
            id: { type: "integer" },
            question: { type: "string" },
            endDate: { type: "string", format: "date-time" },
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  text: { type: "string" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            title: { type: "string" },
            message: { type: "string" },
            status: { type: "string", default: "Unread" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ChatMessage: {
          type: "object",
          properties: {
            id: { type: "integer" },
            sessionId: { type: "string" },
            text: { type: "string" },
            type: { type: "string", default: "text" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            id: { type: "integer" },
            user: { type: "string" },
            action: { type: "string" },
            target: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
            ip: { type: "string" },
          },
        },
        ForumComment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            forumId: { type: "integer" },
            userId: { type: "integer" },
            content: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            fields: { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            totalItems: { type: "integer" },
            totalPages: { type: "integer" },
            currentPage: { type: "integer" },
            items: { type: "array", items: {} },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
