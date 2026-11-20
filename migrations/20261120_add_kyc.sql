-- MySQL Migration: Add KYC support to Users and create KycSubmissions table
-- Database: pbi_dashboard

-- 1. Add KYC columns to Users table
ALTER TABLE `Users`
  ADD COLUMN `kycStatus` VARCHAR(255) NOT NULL DEFAULT 'unverified' AFTER `lastLogin`,
  ADD COLUMN `isKycVerified` TINYINT(1) NOT NULL DEFAULT 0 AFTER `kycStatus`,
  ADD COLUMN `kycRejectionReason` TEXT NULL AFTER `isKycVerified`;

-- 2. Create KycSubmissions table
CREATE TABLE IF NOT EXISTS `KycSubmissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `nik` VARCHAR(16) NOT NULL,
  `fullName` VARCHAR(255) NOT NULL,
  `birthPlace` VARCHAR(255) NOT NULL,
  `birthDate` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `province` VARCHAR(255) NOT NULL,
  `ktpImage` VARCHAR(255) NOT NULL,
  `selfieImage` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'waiting',
  `rejectionReason` TEXT NULL,
  `reviewedBy` INT NULL,
  `reviewedAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_kyc_submissions_user_id` (`userId`),
  INDEX `idx_kyc_submissions_status` (`status`),
  CONSTRAINT `fk_kyc_submissions_user`
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Rollback (Down Migration) - run manually if reverting
-- ============================================================
-- DROP TABLE IF EXISTS `KycSubmissions`;
-- ALTER TABLE `Users`
--   DROP COLUMN `kycRejectionReason`,
--   DROP COLUMN `isKycVerified`,
--   DROP COLUMN `kycStatus`;
