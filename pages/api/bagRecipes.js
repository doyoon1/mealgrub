import { mongooseConnect } from "@/lib/mongoose";
import { Recipe } from "@/models/Recipe";

export default async function handle(req, res) {
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await Recipe.find({_id:ids}));
}