import { Request, Response } from 'express';
import Plan from '../models/Plan';

export const createPlan = async (req: Request, res: Response) => {
  try {
    const planData = { ...req.body };
    const createPlan = await Plan.create(planData);
    res.status(201).json({
      message: 'Plan created successfully',
      plan: createPlan,
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

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.json({
      message: 'All plans retrieved successfully',
      total: plans.length,
      plans,
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

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({
      message: 'Plan retrieved successfully',
      plan,
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

export const updatePlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    const updateData = { ...req.body };
    await plan.updateOne(updateData);
    await plan.save();
    res.json({
      message: 'Plan updated successfully',
      plan,
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

export const deletePlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    await Plan.findByIdAndDelete(id);
    res.json({
      message: 'Plan deleted successfully',
      plan,
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
