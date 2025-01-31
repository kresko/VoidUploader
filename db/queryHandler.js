const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function registerUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.users.create({
        data: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    });
}

async function getUsersByUsername(email) {
    return await prisma.users.findFirst({
        where: {
            email: email
        }
    });
}

async function getUsersById(id) {
      return await prisma.users.findFirst({
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

async function getFolderByName(folderName) {
    return await prisma.folders.findFirst({
        where: {
            name: folderName
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
    await prisma.files.deleteMany({
        where: {
            folderId: parseInt(folderId)
        }
    })

    return await prisma.folders.delete({
        where: {
            id: parseInt(folderId)
        }
    })
}

async function getAllFiles() {
    return await prisma.files.findMany({});
}

async function getFileById(fileId) {
    return await prisma.files.findFirst({
        where: {
            id: parseInt(fileId)
        }
    })
}

async function insertNewFile(file, folder) {
    return await prisma.files.create({ // tu je pucalo provjeri zkj
        data: {
            name: file.originalname,
            size: file.size,
            path: `/${folder.name}/${file.originalname}`,
            folderId: folder.id
        }
    });
}

async function deleteFile(fileId) {
    return await prisma.files.delete({
        where: {
            id: parseInt(fileId)
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
    getFolderNameById,
    getFolderByName,
    insertNewFile,
    getAllFiles,
    deleteFile,
    getFileById
}
