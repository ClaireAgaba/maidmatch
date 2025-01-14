import { District } from '../models/District';
import { Tribe } from '../models/Tribe';
import { Language } from '../models/Language';
import { Relationship } from '../models/Relationship';
import { AppError } from '../middleware/errorHandler';

interface ReferenceDataItem {
  name: string;
  code?: string;
  description?: string;
}

export const referenceDataService = {
  // Districts
  async addDistrict(data: ReferenceDataItem) {
    const existingDistrict = await District.findOne({ name: data.name });
    if (existingDistrict) {
      throw new AppError(400, 'District already exists');
    }

    const district = new District(data);
    await district.save();
    return district;
  },

  async getDistricts() {
    return District.find().sort({ name: 1 });
  },

  async updateDistrict(id: string, data: Partial<ReferenceDataItem>) {
    const district = await District.findById(id);
    if (!district) {
      throw new AppError(404, 'District not found');
    }

    if (data.name && data.name !== district.name) {
      const existingDistrict = await District.findOne({ name: data.name });
      if (existingDistrict) {
        throw new AppError(400, 'District name already exists');
      }
    }

    Object.assign(district, data);
    await district.save();
    return district;
  },

  async deleteDistrict(id: string) {
    const district = await District.findByIdAndDelete(id);
    if (!district) {
      throw new AppError(404, 'District not found');
    }
    return district;
  },

  // Tribes
  async addTribe(data: ReferenceDataItem) {
    const existingTribe = await Tribe.findOne({ name: data.name });
    if (existingTribe) {
      throw new AppError(400, 'Tribe already exists');
    }

    const tribe = new Tribe(data);
    await tribe.save();
    return tribe;
  },

  async getTribes() {
    return Tribe.find().sort({ name: 1 });
  },

  async updateTribe(id: string, data: Partial<ReferenceDataItem>) {
    const tribe = await Tribe.findById(id);
    if (!tribe) {
      throw new AppError(404, 'Tribe not found');
    }

    if (data.name && data.name !== tribe.name) {
      const existingTribe = await Tribe.findOne({ name: data.name });
      if (existingTribe) {
        throw new AppError(400, 'Tribe name already exists');
      }
    }

    Object.assign(tribe, data);
    await tribe.save();
    return tribe;
  },

  async deleteTribe(id: string) {
    const tribe = await Tribe.findByIdAndDelete(id);
    if (!tribe) {
      throw new AppError(404, 'Tribe not found');
    }
    return tribe;
  },

  // Languages
  async addLanguage(data: ReferenceDataItem) {
    const existingLanguage = await Language.findOne({ name: data.name });
    if (existingLanguage) {
      throw new AppError(400, 'Language already exists');
    }

    const language = new Language(data);
    await language.save();
    return language;
  },

  async getLanguages() {
    return Language.find().sort({ name: 1 });
  },

  async updateLanguage(id: string, data: Partial<ReferenceDataItem>) {
    const language = await Language.findById(id);
    if (!language) {
      throw new AppError(404, 'Language not found');
    }

    if (data.name && data.name !== language.name) {
      const existingLanguage = await Language.findOne({ name: data.name });
      if (existingLanguage) {
        throw new AppError(400, 'Language name already exists');
      }
    }

    Object.assign(language, data);
    await language.save();
    return language;
  },

  async deleteLanguage(id: string) {
    const language = await Language.findByIdAndDelete(id);
    if (!language) {
      throw new AppError(404, 'Language not found');
    }
    return language;
  },

  // Relationships
  async addRelationship(data: ReferenceDataItem) {
    const existingRelationship = await Relationship.findOne({ name: data.name });
    if (existingRelationship) {
      throw new AppError(400, 'Relationship already exists');
    }

    const relationship = new Relationship(data);
    await relationship.save();
    return relationship;
  },

  async getRelationships() {
    return Relationship.find().sort({ name: 1 });
  },

  async updateRelationship(id: string, data: Partial<ReferenceDataItem>) {
    const relationship = await Relationship.findById(id);
    if (!relationship) {
      throw new AppError(404, 'Relationship not found');
    }

    if (data.name && data.name !== relationship.name) {
      const existingRelationship = await Relationship.findOne({ name: data.name });
      if (existingRelationship) {
        throw new AppError(400, 'Relationship name already exists');
      }
    }

    Object.assign(relationship, data);
    await relationship.save();
    return relationship;
  },

  async deleteRelationship(id: string) {
    const relationship = await Relationship.findByIdAndDelete(id);
    if (!relationship) {
      throw new AppError(404, 'Relationship not found');
    }
    return relationship;
  },

  async bulkAddRelationships(relationships: ReferenceDataItem[]) {
    const existingRelationships = await Relationship.find({
      name: { $in: relationships.map(r => r.name) }
    });

    if (existingRelationships.length > 0) {
      throw new AppError(400, 'Some relationships already exist');
    }

    return Relationship.insertMany(relationships);
  },

  // Bulk operations
  async bulkAddDistricts(districts: ReferenceDataItem[]) {
    const existingDistricts = await District.find({
      name: { $in: districts.map(d => d.name) }
    });

    if (existingDistricts.length > 0) {
      throw new AppError(400, 'Some districts already exist');
    }

    return District.insertMany(districts);
  },

  async bulkAddTribes(tribes: ReferenceDataItem[]) {
    const existingTribes = await Tribe.find({
      name: { $in: tribes.map(t => t.name) }
    });

    if (existingTribes.length > 0) {
      throw new AppError(400, 'Some tribes already exist');
    }

    return Tribe.insertMany(tribes);
  },

  async bulkAddLanguages(languages: ReferenceDataItem[]) {
    const existingLanguages = await Language.find({
      name: { $in: languages.map(l => l.name) }
    });

    if (existingLanguages.length > 0) {
      throw new AppError(400, 'Some languages already exist');
    }

    return Language.insertMany(languages);
  },
};
