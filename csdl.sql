CREATE DATABASE DATA_STORE;
GO

USE DATA_STORE;
GO
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Role NVARCHAR(20) NOT NULL DEFAULT 'User'  -- Có thể là 'User', 'Admin'
);
GO
CREATE TABLE Auth (
    UserID INT PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO
CREATE TABLE OtpCodes (
    Email NVARCHAR(255) PRIMARY KEY,
    OTP NVARCHAR(6) NOT NULL,
    ExpiresAt DATETIME NOT NULL
);
GO
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

GO
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO
INSERT INTO Products (ProductName, Description, Price, Stock)
VALUES
(N'Chuột Logitech', N'Chuột không dây chính hãng', 350000, 100),
(N'Bàn phím cơ', N'Bàn phím cơ RGB', 900000, 50),
(N'Màn hình Samsung 24', N'Màn hình 24 inch FullHD', 3000000, 20),
(N'Tai nghe Sony', N'Tai nghe chống ồn', 1200000, 70);

SELECT * FROM Users;
SELECT * FROM Auth;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM OtpCodes;
