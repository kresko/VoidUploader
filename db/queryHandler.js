const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function registerUser(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const test = await prisma.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    });

    const test2 = '';
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

module.exports = {
    registerUser,
    getUsersByUsername,
    getUsersById
}
