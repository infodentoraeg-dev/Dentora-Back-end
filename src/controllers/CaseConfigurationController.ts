import { Request, Response } from 'express';
import CaseConfiguration from '../models/CaseConfiguration';

export const createCaseConfiguration = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;
    const caseConfiguration = await CaseConfiguration.create({
      ...req.body,
      case: caseId,
    });
    res.status(201).json({
      message: 'Case configuration created successfully',
      caseConfiguration,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getCaseConfiguration = async (req: Request, res: Response) => {
  try {
    const caseConfiguration = await CaseConfiguration.findOne({
      case: req.params.id,
    });
    res.status(200).json({
      message: 'Case configuration found successfully',
      caseConfiguration,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const updateCaseConfiguration = async (req: Request, res: Response) => {
  try {
    const caseConfiguration = await CaseConfiguration.findByIdAndUpdate(
      req.params.caseId,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json({
      message: 'Case configuration updated successfully',
      caseConfiguration,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const deleteCaseConfiguration = async (req: Request, res: Response) => {
  try {
    const caseConfiguration = await CaseConfiguration.findByIdAndDelete(
      req.params.caseId,
      {
        new: true,
      },
    );
    res.status(200).json({
      message: 'Case configuration deleted successfully',
      caseConfiguration,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};
