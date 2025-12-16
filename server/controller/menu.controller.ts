export const getMenu = async (req:Request, res:Response) => {
    try {
        const restaurant = await Restaurant.findOne({user:req.id }).populate('menus');
        if(!restaurant){
            return res.status(404).json({
                success:false,
                message:"Restaurant not found"
            })
        }
        return res.status(200).json({
            success:true,
            menus:restaurant.menus
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
import { Request, Response } from "express";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import {Menu} from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose, { ObjectId } from "mongoose";

export const addMenu = async (req:Request, res:Response) => {
    try {
        const {name, description, price} = req.body;
        const file = (req.files as Express.Multer.File[])?.find(f => f.fieldname === 'image');
        if(!file){
            return res.status(400).json({
                success:false,
                message:"Image is required"
            })
        };
        const imageUrl = await uploadImageOnCloudinary(file);
        const menu: any = await Menu.create({
            name , 
            description,
            price,
            image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id });
        if(restaurant){
            restaurant.menus.push(menu._id);
            await restaurant.save();
        }

        return res.status(201).json({
            success:true,
            message:"Menu added successfully",
            menu
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}
export const editMenu = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const {name, description, price} = req.body;
        const file = (req.files as Express.Multer.File[])?.find(f => f.fieldname === 'image');
        const menu = await Menu.findById(id);
        if(!menu){
            return res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return res.status(200).json({
            success:true,
            message:"Menu updated",
            menu,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}
export const deleteMenu = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const menu = await Menu.findById(id);
        if(!menu){
            return res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
        }
        await Menu.findByIdAndDelete(id);
        const restaurant = await Restaurant.findOne({user:req.id });
        if(restaurant){
            restaurant.menus = restaurant.menus.filter((menuId) => menuId.toString() !== id);
            await restaurant.save();
        }

        return res.status(200).json({
            success:true,
            message:"Menu deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}