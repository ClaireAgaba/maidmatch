import express from 'express';
import { District, Tribe, Language, Relationship } from '../models/ReferenceData';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Get all reference data
router.get('/all', async (req, res) => {
  try {
    const districts = await District.find({ active: true });
    const tribes = await Tribe.find({ active: true });
    const languages = await Language.find({ active: true });
    const relationships = await Relationship.find({ active: true });

    res.json({
      districts,
      tribes,
      languages,
      relationships
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get individual reference data types
router.get('/districts', async (req, res) => {
  try {
    const districts = await District.find({ active: true });
    res.json(districts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tribes', async (req, res) => {
  try {
    const tribes = await Tribe.find({ active: true });
    res.json(tribes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({ active: true });
    res.json(languages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/relationships', async (req, res) => {
  try {
    const relationships = await Relationship.find({ active: true });
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes for managing reference data
// Districts
router.post('/districts', adminAuth, async (req, res) => {
  try {
    const district = new District(req.body);
    await district.save();
    res.status(201).json(district);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/districts/:id', adminAuth, async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    res.json(district);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/districts/:id', adminAuth, async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    res.json({ message: 'District deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Similar routes for tribes
router.post('/tribes', adminAuth, async (req, res) => {
  try {
    const tribe = new Tribe(req.body);
    await tribe.save();
    res.status(201).json(tribe);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/tribes/:id', adminAuth, async (req, res) => {
  try {
    const tribe = await Tribe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tribe) {
      return res.status(404).json({ error: 'Tribe not found' });
    }
    res.json(tribe);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tribes/:id', adminAuth, async (req, res) => {
  try {
    const tribe = await Tribe.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!tribe) {
      return res.status(404).json({ error: 'Tribe not found' });
    }
    res.json({ message: 'Tribe deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Similar routes for languages
router.post('/languages', adminAuth, async (req, res) => {
  try {
    const language = new Language(req.body);
    await language.save();
    res.status(201).json(language);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/languages/:id', adminAuth, async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    res.json(language);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/languages/:id', adminAuth, async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    res.json({ message: 'Language deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Similar routes for relationships
router.post('/relationships', adminAuth, async (req, res) => {
  try {
    const relationship = new Relationship(req.body);
    await relationship.save();
    res.status(201).json(relationship);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/relationships/:id', adminAuth, async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json(relationship);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/relationships/:id', adminAuth, async (req, res) => {
  try {
    const relationship = await Relationship.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json({ message: 'Relationship deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export const referenceDataRoutes = router;
