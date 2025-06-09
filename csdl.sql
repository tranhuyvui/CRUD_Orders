-- Tạo database
CREATE DATABASE DATASTORES;
GO

USE DATASTORES;
GO

-- Bảng Users: thông tin người dùng, thêm Address và Phone
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Address NVARCHAR(255) NULL,         -- Địa chỉ mặc định của user
    Phone NVARCHAR(20) NULL,             -- Số điện thoại mặc định
    CreatedAt DATETIME DEFAULT GETDATE(),
    Role NVARCHAR(20) NOT NULL DEFAULT 'User'  -- 'User' hoặc 'Admin'
);
GO

-- Bảng Auth: thông tin đăng nhập liên kết với Users
CREATE TABLE Auth (
    UserID INT PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- Bảng OtpCodes: dùng cho xác thực OTP
CREATE TABLE OtpCodes (
    Email NVARCHAR(255) PRIMARY KEY,
    OTP NVARCHAR(6) NOT NULL,
    ExpiresAt DATETIME NOT NULL
);
GO

-- Bảng Products: sản phẩm bán
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Bảng Orders: lưu đơn hàng, thêm địa chỉ và số điện thoại giao hàng riêng cho từng đơn
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    ShippingAddress NVARCHAR(255) NULL,   -- Địa chỉ giao hàng riêng cho đơn này
    Phone NVARCHAR(20) NULL,               -- Số điện thoại liên hệ đơn này
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',  -- Trạng thái đơn: Pending, Confirmed, Shipped, Delivered
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

-- Thêm 10 sản phẩm mẫu
INSERT INTO Products (ProductName, Description, Price, Stock)
VALUES
(N'Chuột Logitech', N'Chuột không dây chính hãng', 350000, 100),
(N'Bàn phím cơ', N'Bàn phím cơ RGB', 900000, 50),
(N'Màn hình Samsung 24"', N'Màn hình 24 inch FullHD', 3000000, 20),
(N'Tai nghe Sony', N'Tai nghe chống ồn', 1200000, 70),
(N'Ổ cứng SSD 500GB', N'Ổ cứng thể rắn tốc độ cao', 1500000, 40),
(N'Laptop Dell', N'Laptop văn phòng hiệu năng cao', 15000000, 15),
(N'Bàn phím Bluetooth', N'Bàn phím không dây Bluetooth', 600000, 30),
(N'Chuột gaming Razer', N'Chuột chuyên dụng cho game thủ', 1200000, 25),
(N'Monitor LG 27"', N'Màn hình 27 inch độ phân giải cao', 4500000, 10),
(N'Tai nghe Apple AirPods', N'Tai nghe không dây Apple AirPods', 3500000, 50);
GO

-- Kiểm tra dữ liệu
SELECT * FROM Users;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM Auth;
SELECT * FROM OtpCodes;
