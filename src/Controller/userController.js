// #Task route solution
const userModel = require('../Models/User');
const blogModel = require('../Models/Blog');
const { default: mongoose } = require('mongoose');
const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'supersecret', {
        expiresIn: maxAge
    });
};

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({ name: name, email: email, password: hashedPassword });
        const token = createToken(user.name);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const login = async (req, res) => {
    // TODO: Login the user
}

const logout = async (req, res) => {
    // TODO Logout the user
}


const getUsers = async (req, res) => {
    const users = await userModel.find({}).sort({ createdAt: -1 })
    res.status(200).json(users)
}

// create blog
const createBlog = async (req, res) => {
    /*
    1- get the title and body and authorId from the request body
    2- create a new blog with the title, body and authorId
    3- send the new blog as a response
    */
    const { title, body, author } = req.body;
    try {
        const blog = await blogModel.create({ title, body, author });
        res.status(200).json(blog)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// get blogs
const getBlogs = async (req, res) => {
    const blogs = await blogModel.find({}).sort({ createdAt: -1 })
    // for (let index = 0; index < blogs.length; index++) {
    //     const element = blogs[index];
    //     console.log(element.id);
    //}
    res.status(200).json(blogs)
}
// filter blogs by author
const filterBlog = async (req, res) => {
    /*
    1- get the author id from the request query
    2- find all the blogs that have the same author id
    3- send the blogs as a response
    */
    const userId = req.query.userId;
    // check if userId is not empty
    if (userId) {
        const result = await blogModel.find({ author: mongoose.Types.ObjectId(userId) }).populate('author');
        res.status(200).json(result)
    } else {
        res.status(400).json({ error: "userId is required" })
    }
}





module.exports = { signUp, logout, getUsers, createBlog, filterBlog, getBlogs, login };
