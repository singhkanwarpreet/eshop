-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2021 at 07:30 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`, `email`, `type`) VALUES
('daljit', '123', 'daljit@gmail.com', 'Admin'),
('kanwar', '123', 'kpsmehta@gmail.com', 'Admin'),
('Noorah', '123', 'noorah@gmail.com', 'Admin'),
('palwinder', '123', 'palwinder@gmail.com', 'Admin'),
('ravneet', '123', 'ravneetsohii821@gmail.com', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `id` int(11) NOT NULL,
  `grandtotal` float NOT NULL,
  `datetime` datetime NOT NULL,
  `paymentmethod` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postalcode` varchar(6) NOT NULL,
  `address` text NOT NULL,
  `remarks` text NOT NULL,
  `status` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`id`, `grandtotal`, `datetime`, `paymentmethod`, `province`, `postalcode`, `address`, `remarks`, `status`, `username`) VALUES
(11, 551, '2021-03-24 17:19:31', 'COD', 'Quebec', 'H4L3N1', '1240 RUE DECARIE, SAINT  CATHERINE', 'leave at door', 'cancelled', 'kanwar'),
(12, 469, '2021-03-24 17:26:40', 'COD', 'Quebec', 'H4L3N1', 'Mont Royal, Montreal', 'Door to Door', 'cancelled', 'kanwar'),
(13, 551, '2021-03-25 19:03:56', 'COD', 'Quebec', 'H4L3N1', 'Rue Decarie', 'door to door', 'cancelled', 'kanwar'),
(14, 1765, '2021-03-27 16:49:24', 'COD', 'Quebec', 'H4L3K1', '10110 Place Meilleur, Montreal', 'deliver between 10 am to 2 pm', 'placed', 'kanwar'),
(15, 1910, '2021-03-27 17:05:44', 'COD', 'Quebec', 'H4L3K5', '10110 Place Meilleur, Montreal', 'deliver after 4pm', 'placed', 'kanwar'),
(16, 2468, '2021-03-27 18:38:24', 'COD', 'Quebec', 'H4L3N1', '1240 Rue Decarie', 'Leave at door', 'placed', 'kanwar'),
(19, 4215, '2021-03-31 11:29:46', 'COD', 'Quebec', 'H4L3N1', '1240 rue decarie', 'deliver after 2pm', 'cancelled', 'abc');

-- --------------------------------------------------------

--
-- Table structure for table `bill_detail`
--

CREATE TABLE `bill_detail` (
  `id` int(11) NOT NULL,
  `price` float NOT NULL,
  `discount` int(10) NOT NULL,
  `netprice` float(10,2) NOT NULL,
  `quantity` int(10) NOT NULL,
  `productid` int(11) NOT NULL,
  `billid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bill_detail`
--

INSERT INTO `bill_detail` (`id`, `price`, `discount`, `netprice`, `quantity`, `productid`, `billid`) VALUES
(15, 551.08, 8, 551.08, 1, 105, 11),
(16, 469.06, 6, 469.06, 1, 115, 12),
(17, 551.08, 8, 551.08, 1, 105, 13),
(18, 1764.6, 15, 1764.60, 1, 106, 14),
(19, 1910.09, 9, 1910.09, 1, 107, 15),
(23, 551.08, 8, 2755.40, 5, 105, 19),
(24, 364.8, 5, 1459.20, 4, 109, 19);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryid` int(11) NOT NULL,
  `categoryname` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `supercategory` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryid`, `categoryname`, `description`, `supercategory`) VALUES
(54, 'men', 'men wear', 'Men'),
(55, 'women', 'women wear', 'Women'),
(56, 'kids', 'kids wear', 'Kids'),
(59, 'shoes', 'shoes', 'Men'),
(60, 'warmer', 'winter', 'Men');

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE `contactus` (
  `conid` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `conEmail` varchar(100) NOT NULL,
  `messageBox` text NOT NULL,
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contactus`
--

INSERT INTO `contactus` (`conid`, `fullname`, `conEmail`, `messageBox`, `datetime`) VALUES
(4, 'kps', 'kps@gmail.com', 'hhhh', '2021-03-27 19:42:25');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productid` int(11) NOT NULL,
  `productname` varchar(200) NOT NULL,
  `price` float NOT NULL,
  `discount` float NOT NULL,
  `photo` varchar(200) NOT NULL,
  `pdescription` text NOT NULL,
  `subcategoryid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productid`, `productname`, `price`, `discount`, `photo`, `pdescription`, `subcategoryid`) VALUES
(103, 'roadster', 999, 10, 'product_images/11.jpg', 'men regular fit casual shirt', 53),
(104, 'highlander', 699, 9, 'product_images/8.jpg', 'slim fit casual shirt', 53),
(105, 'dennis lingo', 599, 8, 'product_images/4.jpg', 'men slim fit casual shirt', 53),
(106, 'levis', 2076, 15, 'product_images/botm-2.jpg', 'men skinny fit jeans', 54),
(107, 'reebok', 2099, 9, 'product_images/10.jpg', 'men solid sneaker', 55),
(108, 'libas', 1299, 5, 'product_images/ind-2.jpg', 'printed kurta', 56),
(109, 'harpa', 384, 5, 'product_images/13.jpg', 'solid top', 57),
(110, 'puma', 499, 10, 'product_images/15.jpg', 'women ballerinas', 58),
(111, 'wildcraft', 2499, 3, 'product_images/product5.jpg', 'shoulder bag', 63),
(112, 'ventra', 454, 8, 'product_images/bc-1.jpg', 'tshirt', 59),
(113, 'fila', 999, 15, 'product_images/bfwear-4.jpg', 'kids sneakers', 61),
(114, 'manzon', 685, 5, 'product_images/gc-3.jpg', 'girls flare dress', 60),
(115, 'fila', 499, 6, 'product_images/gfwear-1.jpg', 'kids sneakers', 62);

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `stockid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `dateofstock` datetime NOT NULL,
  `productid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`stockid`, `qty`, `dateofstock`, `productid`) VALUES
(106, 100, '2021-03-19 16:07:42', 104),
(107, 100, '2021-03-19 16:07:46', 103),
(108, 100, '2021-03-19 16:08:10', 106),
(109, 100, '2021-03-19 16:08:14', 107),
(110, 100, '2021-03-19 16:08:21', 108),
(111, 100, '2021-03-19 16:08:25', 109),
(112, 100, '2021-03-19 16:08:29', 110),
(113, 100, '2021-03-19 16:08:33', 111),
(114, 100, '2021-03-19 16:08:39', 112),
(115, 100, '2021-03-19 16:08:42', 114),
(116, 99, '2021-03-19 16:20:08', 113),
(117, 100, '2021-03-27 19:39:39', 115),
(118, 100, '2021-03-19 16:22:07', 105);

-- --------------------------------------------------------

--
-- Table structure for table `subcategory`
--

CREATE TABLE `subcategory` (
  `subcategoryid` int(11) NOT NULL,
  `subcategoryname` varchar(50) NOT NULL,
  `sdescription` varchar(200) NOT NULL,
  `categoryid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`subcategoryid`, `subcategoryname`, `sdescription`, `categoryid`) VALUES
(53, 'topwear', 'topwear', 54),
(54, 'bottomwear', 'bottomwear', 54),
(55, 'footwear', 'footwear', 54),
(56, 'indian wear', 'indian wear', 55),
(57, 'western wear', 'western wear', 55),
(58, 'footwear', 'footwear', 55),
(59, 'boys clothing', 'boys clothing', 56),
(60, 'girls clothing', 'girls clothing', 56),
(61, 'boys footwear', 'boys footwear', 56),
(62, 'girls footwear', 'girls footwear', 56),
(63, 'handbags', 'all types of handbags', 55);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `mobileno` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `email`, `password`, `firstname`, `lastname`, `address`, `mobileno`) VALUES
('abc', 'abc@gmail.com', '123', 'abc', 'cd', '132 hashash ', '515378836766'),
('daljit', 'daljit@gmail.com', '123', 'daljit', 'kaur', 'Saint Catherine', '5149184942'),
('kanwar', 'kpsmehta@gmail.com', '123', 'Kanwarpreet', 'Singh', 'Rue Decarie', '5145618794'),
('ravneet', 'ravneetsohii821@gmail.com', 'sohi', 'Ravneet', 'ravneet', '4650 avenue dupuis', '4389211372');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk` (`username`);

--
-- Indexes for table `bill_detail`
--
ALTER TABLE `bill_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk` (`productid`),
  ADD KEY `billid` (`billid`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryid`);

--
-- Indexes for table `contactus`
--
ALTER TABLE `contactus`
  ADD PRIMARY KEY (`conid`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productid`),
  ADD KEY `fk` (`subcategoryid`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`stockid`),
  ADD KEY `fk` (`productid`);

--
-- Indexes for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`subcategoryid`),
  ADD KEY `fk` (`categoryid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `bill_detail`
--
ALTER TABLE `bill_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `contactus`
--
ALTER TABLE `contactus`
  MODIFY `conid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `stockid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `subcategory`
--
ALTER TABLE `subcategory`
  MODIFY `subcategoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Constraints for table `bill_detail`
--
ALTER TABLE `bill_detail`
  ADD CONSTRAINT `bill_detail_ibfk_1` FOREIGN KEY (`billid`) REFERENCES `bill` (`id`),
  ADD CONSTRAINT `bill_detail_ibfk_2` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`subcategoryid`) REFERENCES `subcategory` (`subcategoryid`);

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`);

--
-- Constraints for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
