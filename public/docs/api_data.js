define({ "api": [
  {
    "type": "POST",
    "url": "/login",
    "title": "1. Authenticate an user and get a JWT on success",
    "name": "Login",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "handle",
            "description": "<p>User email/mobile to login with</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password (plaintext)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expiry",
            "defaultValue": "720",
            "description": "<p>Life of the JWT in hours</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n     error: false,\n     isAdmin: false,\n     handle: 'foo@bar.com',\n     token: 'XXX.YYYYY.ZZZZZZZ'\n   }",
          "type": "JSON"
        }
      ]
    },
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "method",
    "url": "/path",
    "title": "2. Request to send forgotten password",
    "name": "requestForgottenPass",
    "group": "Auth",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email for which password is forgotten</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/auth/index.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/book",
    "title": "3.0 Create a new Book",
    "name": "createBook",
    "group": "Book",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Book title</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "readingLevel",
            "description": "<p>Book readingLevel</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "noOfCopies",
            "description": "<p>No. of copies of this Book to add to the library</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "interestLevel",
            "description": "<p>Book interest level</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "authors",
            "description": "<p>Book authors</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "genres",
            "description": "<p>Book genres</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "publishedOn",
            "description": "<p>Book publishedOn</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "synopsis",
            "description": "<p>Book synopsis</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "wordCount",
            "description": "<p>Book wordCount</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "noOfPages",
            "description": "<p>Book noOfPages</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bookType",
            "description": "<p>Book bookType</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "frontCoverUrl",
            "description": "<p>Book frontCoverUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "backCoverUrl",
            "description": "<p>Book backCoverUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "series",
            "description": "<p>Book series</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "bookNo",
            "description": "<p>Book bookNo</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "price",
            "description": "<p>Book price</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "quizUrl",
            "description": "<p>Book quizUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "renaissanceId",
            "description": "<p>Book renaissanceId</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    book: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/index.js",
    "groupTitle": "Book"
  },
  {
    "type": "delete",
    "url": "/book/:id",
    "title": "4.0 Delete a Book by _id",
    "name": "deleteBook",
    "group": "Book",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Book to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/index.js",
    "groupTitle": "Book"
  },
  {
    "type": "put",
    "url": "/book/:id",
    "title": "4.0 Edit a Book by _id",
    "name": "editBook",
    "group": "Book",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Book to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "authors",
            "description": "<p>Book authors</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "genres",
            "description": "<p>Book genres</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "publishedOn",
            "description": "<p>Book publishedOn</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Book title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "readingLevel",
            "description": "<p>Book readingLevel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "interestLevel",
            "description": "<p>Book interestLevel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "synopsis",
            "description": "<p>Book synopsis</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "wordCount",
            "description": "<p>Book wordCount</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "noOfPages",
            "description": "<p>Book noOfPages</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bookType",
            "description": "<p>Book bookType</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "frontCoverUrl",
            "description": "<p>Book frontCoverUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "backCoverUrl",
            "description": "<p>Book backCoverUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "series",
            "description": "<p>Book series</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "bookNo",
            "description": "<p>Book bookNo</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "price",
            "description": "<p>Book price</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "quizUrl",
            "description": "<p>Book quizUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "renaissanceId",
            "description": "<p>Book renaissanceId</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Book isActive</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    book: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/index.js",
    "groupTitle": "Book"
  },
  {
    "type": "post",
    "url": "/books",
    "title": "1.0 Fetch all the Books",
    "name": "fetchBooks",
    "group": "Book",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "level",
            "description": "<p>Optionally filter by reading level</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "authors",
            "description": "<p>Optionally filter results by book authors</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "genres",
            "description": "<p>Optionally filter results by book genres</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/index.js",
    "groupTitle": "Book"
  },
  {
    "type": "get",
    "url": "/book/:id",
    "title": "2.0 Find a Book by _id",
    "name": "getBook",
    "group": "Book",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Book to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    book: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/index.js",
    "groupTitle": "Book"
  },
  {
    "type": "post",
    "url": "/bookcopy",
    "title": "3.0 Add one or more new copy of a book",
    "name": "createBookCopy",
    "group": "Inventory_Library",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bookId",
            "description": "<p>The _id of the Book to add (Exactly one of these is mandatory!)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "noOfCopies",
            "defaultValue": "1",
            "description": "<p>No. of copies of this Book to add to the library</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    book: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/copies.js",
    "groupTitle": "Inventory_Library"
  },
  {
    "type": "get",
    "url": "/bookcopies/:bookid",
    "title": "1.0 Fetch all copies of a Book in the library",
    "name": "fetchBookCopies",
    "group": "Inventory_Library",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bookid",
            "description": "<p><code>URL Param</code> _id of the book</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    books: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/copies.js",
    "groupTitle": "Inventory_Library"
  },
  {
    "type": "post",
    "url": "/getbookcopy",
    "title": "2.0 Find a BookCopy by its unique code or _id",
    "name": "getBookCopy",
    "group": "Inventory_Library",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bookCopyId",
            "description": "<p>The _id of the BookCopy to find (Exactly one of these is mandatory!)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "code",
            "description": "<p>The code of the BookCopy to find (Exactly one of these is mandatory!)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    book: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/copies.js",
    "groupTitle": "Inventory_Library"
  },
  {
    "type": "put",
    "url": "/bookcopy/:id?",
    "title": "3.0 Mark a BookCopy as bought / retired / lost (remove it from library)",
    "name": "removeBookCopy",
    "group": "Inventory_Library",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the BookCopy to remove. If none is mentioned, an available copy will be randomly selected.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bookId",
            "description": "<p>_id of the book to remove. Mandatory if <code>id</code> is not supplied as url param.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The changed status <code>enum: [&quot;retired&quot;, &quot;lost&quot;, &quot;sold&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "boughtBy",
            "description": "<p>_id of the subscriber who bought the book copy. MANDATORY when <code>status</code> above is <code>sold</code></p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/copies.js",
    "groupTitle": "Inventory_Library"
  },
  {
    "type": "post",
    "url": "/me/findbooks",
    "title": "1.0 Search for a book to read",
    "name": "findBooksToRead",
    "group": "MyBooks",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Optionally filter results by book title</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "authors",
            "description": "<p>Optionally filter results by book authors</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "genres",
            "description": "<p>Optionally filter results by book genres</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "showChallengeLevel",
            "defaultValue": "false",
            "description": "<p>Whether to include challenge level books in search results</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/books.js",
    "groupTitle": "MyBooks"
  },
  {
    "type": "get",
    "url": "/me",
    "title": "1.0 Fetch my profile",
    "name": "getMyProfile",
    "group": "MyProfile",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/profile.js",
    "groupTitle": "MyProfile"
  },
  {
    "type": "post",
    "url": "/me/help",
    "title": "Send help query to admins",
    "name": "helpQuerySend",
    "group": "MyProfile",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>Help query subject</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>Help query message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/profile.js",
    "groupTitle": "MyProfile"
  },
  {
    "type": "put",
    "url": "/me",
    "title": "Request admin to edit profile details",
    "name": "requestProfileEdit",
    "group": "MyProfile",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "fieldsToChange",
            "description": "<p>Array of fields to edit and their new values</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldsToChange.fieldName",
            "description": "<p>Name of field to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "fieldsToChange.value",
            "description": "<p>New value for said field name</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/profile.js",
    "groupTitle": "MyProfile"
  },
  {
    "type": "post",
    "url": "/me/readinglist",
    "title": "3.0 Borrow a book",
    "name": "borrowBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bookId",
            "description": "<p>_id of the book to borrow</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    readingListEntry: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "put",
    "url": "/me/readinglist/buy/:id",
    "title": "7.0 Request to Buy a Book in your Reading List",
    "name": "buyBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList entry to buy</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "buyRemarks",
            "description": "<p>Your remark as to how you have paid</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "put",
    "url": "/me/readinglist/cancel/:id",
    "title": "6.0 Request to Cancel a Book in your Reading List because you did'nt like reading it",
    "name": "cancelBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList entry to cancel</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "feedback",
            "description": "<p>Your Feedback (reason to cancel)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "post",
    "url": "/me/readinglists",
    "title": "1.0 Fetch all entries in your ReadingList (including historical)",
    "name": "fetchReadingLists",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "level",
            "description": "<p>Optionally filter by level</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "genres",
            "description": "<p>Optionally filter by genres</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "score",
            "description": "<p>Optionally filter by quiz score</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "rating",
            "description": "<p>Optionally filter by rating given</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "startDate",
            "description": "<p>Optionally filter by start date (in standard date forma)</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "endDate",
            "description": "<p>Optionally filter by end date (in standard date forma). Mandatory if startDate is specified. r</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    readingListEntries: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "get",
    "url": "/me/currentlist",
    "title": "0. Fetch your currently borrowed books (includes _pending_ requests for buying/cancelling & reported lost too)",
    "name": "getCurrentList",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    readingLists: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "get",
    "url": "/me/readingList/:id",
    "title": "2.0 Find a ReadingList entry by _id",
    "name": "getReadingList",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    readingListEntry: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "put",
    "url": "/me/readinglist/lost/:id",
    "title": "8.0 Report a Book in your Reading List as Lost",
    "name": "lostBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList entry to report lost</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "put",
    "url": "/me/readinglist/reissue/:id",
    "title": "5.0 Reissue a Book in your Reading List because you did'nt finish reading it",
    "name": "reissueBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList entry to reissue</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "put",
    "url": "/me/readinglist/return/:id",
    "title": "4.0 Return a Book in your Reading List after reading it",
    "name": "returnBook",
    "group": "MyReadingList",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of your ReadingList entry to return</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "rating",
            "description": "<p>Your Rating</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/me/readingLists.js",
    "groupTitle": "MyReadingList"
  },
  {
    "type": "post",
    "url": "/plan",
    "title": "3.0 Create a new Plan",
    "name": "createPlan",
    "group": "Plan",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Plan title</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "cycleInDays",
            "description": "<p>Plan cycleInDays</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "maxNoOfBooksHeld",
            "description": "<p>Max no. of books subscriber can hold at a time</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "maxNoOfBooksHeld.start",
            "description": "<p>Start date of period for which this maxNoOfBooksHeld.qty applies</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "maxNoOfBooksHeld.end",
            "description": "<p>End date of period for which this maxNoOfBooksHeld.qty applies</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "maxNoOfBooksHeld.number",
            "description": "<p>Actual no. of books subscriber can hold at a time</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "totalNoOfBooks",
            "description": "<p>Total no. of books subscriber can borrow during the plan period</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "validity",
            "description": "<p>Plan validity in days</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "price",
            "description": "<p>Plan price</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>Plan active or not</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    plan: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/plans.js",
    "groupTitle": "Plan"
  },
  {
    "type": "delete",
    "url": "/plan/:id",
    "title": "4.0 Delete a Plan by _id",
    "name": "deletePlan",
    "group": "Plan",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Plan to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/plans.js",
    "groupTitle": "Plan"
  },
  {
    "type": "put",
    "url": "/plan/:id",
    "title": "4.0 Edit a Plan by _id",
    "name": "editPlan",
    "group": "Plan",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Plan to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "title",
            "description": "<p>Plan title</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "cycleInDays",
            "description": "<p>Plan cycleInDays</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "maxNoOfBooksHeld",
            "description": "<p>Max no. of books subscriber can hold at a time. N.B.: Setting this entirely replaces the data in this array field in place, i.e. there is no push/append involved</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "maxNoOfBooksHeld.start",
            "description": "<p>Start date of period for which this maxNoOfBooksHeld.qty applies</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "maxNoOfBooksHeld.end",
            "description": "<p>End date of period for which this maxNoOfBooksHeld.qty applies</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "maxNoOfBooksHeld.number",
            "description": "<p>Actual no. of books subscriber can hold at a time   * @apiParam  {Number} [totalNoOfBooks] Total no. of books subscriber can borrow during the plan period</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "validity",
            "description": "<p>Plan validity in days</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "price",
            "description": "<p>Plan price</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "description": "<p>Plan active or not</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    plan: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/plans.js",
    "groupTitle": "Plan"
  },
  {
    "type": "get",
    "url": "/plan/:id",
    "title": "2.0 Find a Plan by _id",
    "name": "getPlan",
    "group": "Plan",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the Plan to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    plan: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/plans.js",
    "groupTitle": "Plan"
  },
  {
    "type": "post",
    "url": "/device",
    "title": "1. Add a unique device id to the current Subscriber. For usage with OneSignal push notifications",
    "name": "addDevice",
    "group": "PushNotifications",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Device Id to add</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{ error: false, devices: [] }",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/notifications.js",
    "groupTitle": "PushNotifications"
  },
  {
    "type": "delete",
    "url": "/device/:id",
    "title": "2. Remove a device id from the current Subscriber. For usage with OneSignal push notifications",
    "name": "removeDevice",
    "group": "PushNotifications",
    "permission": [
      {
        "name": "Subscriber"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Device Id to remove [URL Parameter]</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{ error: false, devices: [] }",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/notifications.js",
    "groupTitle": "PushNotifications"
  },
  {
    "type": "put",
    "url": "/listrequest/:id",
    "title": "1.2 Approve a pending (cancel or buy) Reading List request",
    "name": "approveListRequests",
    "group": "ReadingListRequests",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> list request _id to approve</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/readingLists.js",
    "groupTitle": "ReadingListRequests"
  },
  {
    "type": "get",
    "url": "/listrequests",
    "title": "0. Fetch all pending Reading List requests",
    "name": "getListRequests",
    "group": "ReadingListRequests",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/readingLists.js",
    "groupTitle": "ReadingListRequests"
  },
  {
    "type": "put",
    "url": "/listrequest/penaltypaid/:id",
    "title": "1.1 Mark a lost book request as penalty paid to free up a slot",
    "name": "penaltyPaid",
    "group": "ReadingListRequests",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> list request _id to approve</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "penaltyAmount",
            "description": "<p>Amount paid as penalty</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/rest/books/readingLists.js",
    "groupTitle": "ReadingListRequests"
  },
  {
    "type": "post",
    "url": "/score/:userid",
    "title": "5.0 Add a Test/ Quiz Score for a Subscriber",
    "name": "addScore",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bookId",
            "description": "<p>_id of Book</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "score",
            "description": "<p>Score to add (obtained from external source)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{ error: false, levelUp: true, userId: \"abcd1234\" }",
          "type": "JSON"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/test-scores.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "3.0 Create a new User",
    "name": "createUser",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "currentPlanId",
            "description": "<p>_id of User current sbscription plan</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "currentPlanStartsOn",
            "description": "<p>User currentPlanStartsOn</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "grade",
            "description": "<p>User grade</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "pickupDay",
            "description": "<p>Pick up day of week for this subscriber. <code>0 -&gt; Sunday, 1 -&gt; Monday, ...., 6 -&gt; Saturday</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isAdmin",
            "defaultValue": "false",
            "description": "<p>User isAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>User phone/mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "whatsApp",
            "description": "<p>User whatsApp no.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "altPhone",
            "description": "<p>User alternative phone no</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>User isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.first",
            "description": "<p>User name.first</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.last",
            "description": "<p>User name.last</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>User gender <code>enum=[&quot;male&quot;, &quot;female&quot;, &quot;other&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "dob",
            "description": "<p>User dob</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "profilePicUrl",
            "description": "<p>User profilePicUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "parentName",
            "description": "<p>User parentName</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parentName.first",
            "description": "<p>User parentName.first</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parentName.last",
            "description": "<p>User parentName.last</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "school",
            "description": "<p>User school</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolCity",
            "description": "<p>User school city</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "location",
            "description": "<p>User location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "postalAddress",
            "description": "<p>User postalAddress</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "city",
            "description": "<p>User city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pin",
            "description": "<p>User pin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "state",
            "description": "<p>User state</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "notes",
            "description": "<p>User notes</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstLanguage",
            "description": "<p>User firstLanguage</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "currentLevel",
            "defaultValue": "1.0",
            "description": "<p>User currentLevel</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "put",
    "url": "/userlevel/:id",
    "title": "5.0 Manually change Subscriber Level",
    "name": "deleteUser",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to edit level</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "level",
            "description": "<p>New level</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "comment",
            "description": "<p>Reason for manually editing level</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "delete",
    "url": "/user/:id",
    "title": "4.0 Delete a User by _id",
    "name": "deleteUser",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    error : false,\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "put",
    "url": "/user/:id",
    "title": "4.0 Edit a User by _id",
    "name": "editUser",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to edit</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isAdmin",
            "defaultValue": "false",
            "description": "<p>User isAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>User phone</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "whatsApp",
            "description": "<p>User whatsApp no.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "altPhone",
            "description": "<p>User alternative phone no</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isActive",
            "defaultValue": "true",
            "description": "<p>User isActive</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.first",
            "description": "<p>User name.first</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.last",
            "description": "<p>User name.last</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "gender",
            "description": "<p>User gender <code>enum=[&quot;male&quot;, &quot;female&quot;, &quot;other&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "dob",
            "description": "<p>User dob</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "profilePicUrl",
            "description": "<p>User profilePicUrl</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "parentName",
            "description": "<p>User parentName</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parentName.first",
            "description": "<p>User parentName.first</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parentName.last",
            "description": "<p>User parentName.last</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "school",
            "description": "<p>User school</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schoolCity",
            "description": "<p>User school city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "grade",
            "description": "<p>User grade</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "pickupDay",
            "description": "<p>Pick up day of week for this subscriber. <code>0 -&gt; Sunday, 1 -&gt; Monday, ...., 6 -&gt; Saturday</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "location",
            "description": "<p>User location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "postalAddress",
            "description": "<p>User postalAddress</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "city",
            "description": "<p>User city</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pin",
            "description": "<p>User pin</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "state",
            "description": "<p>User state</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "notes",
            "description": "<p>User notes</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstLanguage",
            "description": "<p>User firstLanguage</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "currentPlanId",
            "description": "<p>_id of User current sbscription plan</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": true,
            "field": "currentPlanStartsOn",
            "description": "<p>User currentPlanStartsOn</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "1.0 Fetch all the Users",
    "name": "fetchUsers",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "level",
            "description": "<p>Optionally filter by user reading level</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "plan",
            "description": "<p>Optionally filter by current plan</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "location",
            "description": "<p>Optionally filter by user location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "school",
            "description": "<p>Optionally filter by user school</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "grade",
            "description": "<p>Optionally filter by user grade</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "status",
            "description": "<p>Optionally filter by active/inactive users</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    users: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "2.0 Find a User by _id",
    "name": "getUser",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p><code>URL Param</code> The _id of the User to find</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    user: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/users.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "post",
    "url": "/communicate",
    "title": "6.0 Send Push Notif OR Email to one or more subscribers",
    "name": "notifySubscribers",
    "group": "Subscriber",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "subscriberIds",
            "description": "<p>List of _id-s for subscribers to communicate with</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>What type of communication to send <code>enum [&quot;email&quot;, &quot;push&quot;]</code></p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "msg",
            "description": "<p>Message to send</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subject",
            "description": "<p>Subject/ Title</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "allUsers",
            "defaultValue": "false",
            "description": "<p>For type==push only. If set to <code>true</code>, will send push notifications to all devices, irrespective of whether the corrs. user is logged in or not.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    plan: {}\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/communicate.js",
    "groupTitle": "Subscriber"
  },
  {
    "type": "get",
    "url": "/plans",
    "title": "1.0 Fetch all the Plans",
    "name": "fetchPlans",
    "group": "SubscriptionPlan",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>The JWT Token in format &quot;Bearer xxxx.yyyy.zzzz&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response: 200 OK",
          "content": "{\n    error : false,\n    plans: [{}]\n}",
          "type": "type"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rest/subscribers/plans.js",
    "groupTitle": "SubscriptionPlan"
  }
] });
