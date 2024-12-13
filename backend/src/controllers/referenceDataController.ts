import { Request, Response } from 'express';
import { District, Tribe, Language, Relationship } from '../models/ReferenceData';

export const referenceDataController = {
  // Get all reference data
  getAllReferenceData: async (req: Request, res: Response) => {
    try {
      const [districts, tribes, languages, relationships] = await Promise.all([
        District.find({}),
        Tribe.find({}),
        Language.find({}),
        Relationship.find({})
      ]);

      res.json({
        districts,
        tribes,
        languages,
        relationships
      });
    } catch (error) {
      console.error('Error fetching reference data:', error);
      res.status(500).json({ message: 'Error fetching reference data' });
    }
  },

  // Add new reference data item
  addReferenceData: async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const { name, region } = req.body;

      let newItem;
      switch (type) {
        case 'district':
          if (!region) {
            return res.status(400).json({ message: 'Region is required for districts' });
          }
          newItem = new District({ name, region });
          break;
        case 'tribe':
          newItem = new Tribe({ name });
          break;
        case 'language':
          newItem = new Language({ name });
          break;
        case 'relationship':
          newItem = new Relationship({ name });
          break;
        default:
          return res.status(400).json({ message: 'Invalid reference data type' });
      }

      await newItem.save();
      res.status(201).json(newItem);
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Item already exists' });
      } else {
        console.error('Error adding reference data:', error);
        res.status(500).json({ message: 'Error adding reference data' });
      }
    }
  },

  // Update reference data item
  updateReferenceData: async (req: Request, res: Response) => {
    try {
      const { type, id } = req.params;
      const { name, region, active } = req.body;

      let item;
      switch (type) {
        case 'district':
          item = await District.findByIdAndUpdate(
            id,
            { name, region, active },
            { new: true }
          );
          break;
        case 'tribe':
          item = await Tribe.findByIdAndUpdate(
            id,
            { name, active },
            { new: true }
          );
          break;
        case 'language':
          item = await Language.findByIdAndUpdate(
            id,
            { name, active },
            { new: true }
          );
          break;
        case 'relationship':
          item = await Relationship.findByIdAndUpdate(
            id,
            { name, active },
            { new: true }
          );
          break;
        default:
          return res.status(400).json({ message: 'Invalid reference data type' });
      }

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error updating reference data:', error);
      res.status(500).json({ message: 'Error updating reference data' });
    }
  },

  // Delete reference data item (soft delete by setting active to false)
  deleteReferenceData: async (req: Request, res: Response) => {
    try {
      const { type, id } = req.params;

      let item;
      switch (type) {
        case 'district':
          item = await District.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
          );
          break;
        case 'tribe':
          item = await Tribe.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
          );
          break;
        case 'language':
          item = await Language.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
          );
          break;
        case 'relationship':
          item = await Relationship.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
          );
          break;
        default:
          return res.status(400).json({ message: 'Invalid reference data type' });
      }

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      res.json({ message: 'Item deactivated successfully' });
    } catch (error) {
      console.error('Error deleting reference data:', error);
      res.status(500).json({ message: 'Error deleting reference data' });
    }
  }
};
