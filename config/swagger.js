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
        url: "http://localhost:4000",
        description: "Development server",
      },
      {
        url: "http://154.26.137.37:4173",
        description: "Production server",
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
            categoryId: { type: "integer" },
            description: { type: "string" },
            stock: { type: "integer" },
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
        Forum: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            userId: { type: "integer" },
            userName: { type: "string" },
            category: { type: "string" },
            image: { type: "string" },
            viewCount: { type: "integer" },
            likeCount: { type: "integer" },
            commentCount: { type: "integer" },
            status: { type: "string", enum: ["active", "closed", "archived"] },
            isPinned: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date" },
            time: { type: "string" },
            location: { type: "string" },
            image: { type: "string" },
            category: { type: "string" },
            status: {
              type: "string",
              enum: ["active", "cancelled", "completed"],
            },
            createdBy: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Media: {
          type: "object",
          properties: {
            id: { type: "integer" },
            filename: { type: "string" },
            originalname: { type: "string" },
            mimetype: { type: "string" },
            size: { type: "integer" },
            url: { type: "string" },
            type: {
              type: "string",
              enum: ["image", "video", "document", "audio", "other"],
            },
            userId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SocialMedia: {
          type: "object",
          properties: {
            id: { type: "integer" },
            platform: { type: "string" },
            url: { type: "string" },
            icon: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
            sortOrder: { type: "integer" },
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
        Voucher: {
          type: "object",
          properties: {
            id: { type: "integer" },
            code: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            discountType: { type: "string", enum: ["percentage", "fixed"] },
            discountValue: { type: "number" },
            minPurchase: { type: "number" },
            maxDiscount: { type: "number" },
            usageLimit: { type: "integer" },
            usedCount: { type: "integer" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["active", "inactive", "expired"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Discount: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            discountType: { type: "string", enum: ["percentage", "fixed"] },
            discountValue: { type: "number" },
            minPurchase: { type: "number" },
            maxDiscount: { type: "number" },
            applicableTo: {
              type: "string",
              enum: ["all", "category", "product"],
            },
            applicableIds: { type: "array", items: { type: "integer" } },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["active", "inactive"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            transactionNumber: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "integer" },
                  name: { type: "string" },
                  price: { type: "number" },
                  quantity: { type: "integer" },
                },
              },
            },
            subtotal: { type: "number" },
            discountAmount: { type: "number" },
            voucherCode: { type: "string" },
            voucherDiscount: { type: "number" },
            tax: { type: "number" },
            total: { type: "number" },
            paymentMethod: {
              type: "string",
              enum: [
                "cash",
                "credit_card",
                "debit_card",
                "e_wallet",
                "bank_transfer",
              ],
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "failed", "refunded"],
            },
            status: {
              type: "string",
              enum: ["pending", "processing", "completed", "cancelled"],
            },
            notes: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductCategory: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            parentId: { type: "integer" },
            status: { type: "string", enum: ["active", "inactive"] },
            sortOrder: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            file: {
              type: "object",
              properties: {
                filename: { type: "string" },
                originalname: { type: "string" },
                path: { type: "string" },
                size: { type: "integer" },
                url: { type: "string" },
              },
            },
          },
        },
        MultipleUploadResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  originalname: { type: "string" },
                  size: { type: "integer" },
                  url: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
