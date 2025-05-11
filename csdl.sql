-- Tạo CSDL
CREATE DATABASE UserOrderDB;
GO

-- Sử dụng CSDL vừa tạo
USE UserOrderDB;
GO

-- Tạo bảng Auth mới có thêm Username (tên tài khoản đăng nhập)
CREATE TABLE Auth (
    UserID INT PRIMARY KEY,  -- Cũng là khóa ngoại
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Tạo bảng Users
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Tạo bảng Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductName NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

ALTER TABLE Users ADD Role NVARCHAR(20) NOT NULL DEFAULT 'User'
-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (FullName, Email, Role)
VALUES 
(N'Nguyễn Văn A', 'a@gmail.com', 'Admin'),  -- Người dùng Admin
(N'Trần Thị B', 'b@yahoo.com', 'User'),    -- Người dùng bình thường
(N'Lê Văn C', 'c@hotmail.com', 'User');     -- Người dùng bình thường
GO
-- Thêm dữ liệu vào bảng Orders 
INSERT INTO Orders (UserID, ProductName, Quantity)
VALUES
(23, N'Chuột Logitech', 2),  -- Đơn hàng của Nguyễn Văn A
(23, N'Bàn phím cơ', 1),     -- Đơn hàng của Nguyễn Văn A
(9, N'Màn hình Samsung 24"', 1),  -- Đơn hàng của Trần Thị B
(10, N'Tai nghe Sony', 3);   -- Đơn hàng của Lê Văn C
GO

SELECT * FROM Users
SELECT * FROM Orders
SELECT * FROM Auth