import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { asyncHandler } from '../middleware/errorHandler';
import { referenceDataService } from '../services/referenceDataService';

const router = express.Router();

// Get all reference data
router.get('/all', asyncHandler(async (req, res) => {
  const [districts, tribes, languages, relationships] = await Promise.all([
    referenceDataService.getDistricts(),
    referenceDataService.getTribes(),
    referenceDataService.getLanguages(),
    referenceDataService.getRelationships(),
  ]);

  res.json({
    districts,
    tribes,
    languages,
    relationships
  });
}));

// Get individual reference data types
router.get('/districts', asyncHandler(async (req, res) => {
  const districts = await referenceDataService.getDistricts();
  res.json(districts);
}));

router.get('/tribes', asyncHandler(async (req, res) => {
  const tribes = await referenceDataService.getTribes();
  res.json(tribes);
}));

router.get('/languages', asyncHandler(async (req, res) => {
  const languages = await referenceDataService.getLanguages();
  res.json(languages);
}));

router.get('/relationships', asyncHandler(async (req, res) => {
  const relationships = await referenceDataService.getRelationships();
  res.json(relationships);
}));

// Districts
router.post('/districts', adminAuth, asyncHandler(async (req, res) => {
  const district = await referenceDataService.addDistrict(req.body);
  res.status(201).json(district);
}));

router.post('/districts/bulk', adminAuth, asyncHandler(async (req, res) => {
  const districts = await referenceDataService.bulkAddDistricts(req.body);
  res.status(201).json(districts);
}));

router.put('/districts/:id', adminAuth, asyncHandler(async (req, res) => {
  const district = await referenceDataService.updateDistrict(req.params.id, req.body);
  res.json(district);
}));

router.delete('/districts/:id', adminAuth, asyncHandler(async (req, res) => {
  await referenceDataService.deleteDistrict(req.params.id);
  res.json({ message: 'District deleted successfully' });
}));

// Tribes
router.post('/tribes', adminAuth, asyncHandler(async (req, res) => {
  const tribe = await referenceDataService.addTribe(req.body);
  res.status(201).json(tribe);
}));

router.post('/tribes/bulk', adminAuth, asyncHandler(async (req, res) => {
  const tribes = await referenceDataService.bulkAddTribes(req.body);
  res.status(201).json(tribes);
}));

router.put('/tribes/:id', adminAuth, asyncHandler(async (req, res) => {
  const tribe = await referenceDataService.updateTribe(req.params.id, req.body);
  res.json(tribe);
}));

router.delete('/tribes/:id', adminAuth, asyncHandler(async (req, res) => {
  await referenceDataService.deleteTribe(req.params.id);
  res.json({ message: 'Tribe deleted successfully' });
}));

// Languages
router.post('/languages', adminAuth, asyncHandler(async (req, res) => {
  const language = await referenceDataService.addLanguage(req.body);
  res.status(201).json(language);
}));

router.post('/languages/bulk', adminAuth, asyncHandler(async (req, res) => {
  const languages = await referenceDataService.bulkAddLanguages(req.body);
  res.status(201).json(languages);
}));

router.put('/languages/:id', adminAuth, asyncHandler(async (req, res) => {
  const language = await referenceDataService.updateLanguage(req.params.id, req.body);
  res.json(language);
}));

router.delete('/languages/:id', adminAuth, asyncHandler(async (req, res) => {
  await referenceDataService.deleteLanguage(req.params.id);
  res.json({ message: 'Language deleted successfully' });
}));

// Relationships
router.post('/relationships', adminAuth, asyncHandler(async (req, res) => {
  const relationship = await referenceDataService.addRelationship(req.body);
  res.status(201).json(relationship);
}));

router.post('/relationships/bulk', adminAuth, asyncHandler(async (req, res) => {
  const relationships = await referenceDataService.bulkAddRelationships(req.body);
  res.status(201).json(relationships);
}));

router.put('/relationships/:id', adminAuth, asyncHandler(async (req, res) => {
  const relationship = await referenceDataService.updateRelationship(req.params.id, req.body);
  res.json(relationship);
}));

router.delete('/relationships/:id', adminAuth, asyncHandler(async (req, res) => {
  await referenceDataService.deleteRelationship(req.params.id);
  res.json({ message: 'Relationship deleted successfully' });
}));

export { router as referenceDataRoutes };
