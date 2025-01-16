const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function registerUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    });
}

async function getUsersByUsername(email) {
    return await prisma.user.findFirst({
        where: {
            email: email
        }
    });
}

async function getUsersById(id) {
      return await prisma.user.findFirst({
        where: {
            id: id
        }
    });
}

async function getAllFoldersByUserId(userId) {
    return await prisma.folders.findMany({
        where: {
            userId: userId
        }
    })
}

async function getFolderNameById(folderId) {
    return await prisma.folders.findFirst({
        where: {
            id: parseInt(folderId)
        }
    })
}

async function insertNewFolder(folderName, userId) {
    return await prisma.folders.create({
        data: {
            name: folderName,
            userId: userId
        }
    })
}

async function deleteFolder(folderId) {
    return await prisma.folders.delete({
        where: {
            id: parseInt(folderId)
        }
    })
}

module.exports = {
    registerUser,
    getUsersByUsername,
    getUsersById,
    getAllFoldersByUserId,
    insertNewFolder,
    deleteFolder,
    getFolderNameById
}
