-- Tạo CSDL
CREATE DATABASE UserOrderDB;
GO

-- Sử dụng CSDL vừa tạo
USE UserOrderDB;
GO

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
GO

-- Thêm dữ liệu mẫu vào Users
INSERT INTO Users (FullName, Email)
VALUES 
(N'Nguyễn Văn A', 'a@gmail.com'),
(N'Trần Thị B', 'b@yahoo.com'),
(N'Lê Văn C', 'c@hotmail.com');
GO

-- Thêm dữ liệu mẫu vào Orders
INSERT INTO Orders (UserID, ProductName, Quantity)
VALUES
(1, N'Chuột Logitech', 2),
(1, N'Bàn phím cơ', 1),
(2, N'Màn hình Samsung 24"', 1),
(3, N'Tai nghe Sony', 3);
GO
SELECT * From Orders
