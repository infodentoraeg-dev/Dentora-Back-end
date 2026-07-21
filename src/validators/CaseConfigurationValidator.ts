import { Request, Response, NextFunction } from 'express';
import Case from '../models/Case';
import { CaseType } from '../enums/CaseType';
import { ImplantRestorationType } from '../enums/ImplantRestorationType';

export const validateCaseConfiguration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const caseId = req.params.caseId || req.params.id;

    const caseExist = await Case.findById(caseId);

    if (!caseExist) {
      return res.status(404).json({
        message: 'Case not found',
      });
    }

    const {
      units,
      connectionType,
      restorationDesign,

      implantRestoration,
      implantType,

      libraryName,
      libraryLink,
      libraryFile,

      material,
      shade,
    } = req.body;

    // =========================
    // Common Validation
    // =========================

    if (!units || units < 1) {
      return res.status(400).json({
        message: 'Units must be greater than 0',
      });
    }

    if (units === 1 && connectionType) {
      return res.status(400).json({
        message: 'Connection type is only allowed for multiple units',
      });
    }

    if (units > 1 && !connectionType) {
      return res.status(400).json({
        message: 'Connection type is required for multiple units',
      });
    }

    if (!restorationDesign) {
      return res.status(400).json({
        message: 'Restoration design is required',
      });
    }

    // =========================
    // CROWN
    // =========================

    if (caseExist.caseType === CaseType.CROWN) {
      if (
        implantRestoration ||
        implantType ||
        libraryName ||
        libraryLink ||
        libraryFile
      ) {
        return res.status(400).json({
          message: 'Implant options are not allowed for Crown cases',
        });
      }
    }

    // =========================
    // BRIDGE
    // =========================

    if (caseExist.caseType === CaseType.BRIDGE) {
      if (units < 2) {
        return res.status(400).json({
          message: 'Bridge must have at least 2 units',
        });
      }

      if (!connectionType) {
        return res.status(400).json({
          message: 'Bridge requires connection type',
        });
      }
    }

    // =========================
    // IMPLANT
    // =========================

    if (caseExist.caseType === CaseType.IMPLANT) {
      if (!implantRestoration) {
        return res.status(400).json({
          message: 'Implant restoration is required',
        });
      }

      if (!implantType) {
        return res.status(400).json({
          message: 'Implant type is required',
        });
      }

      // Scan Body Library

      if (implantRestoration === ImplantRestorationType.SCAN_BODY_LIBRARY) {
        if (!libraryName) {
          return res.status(400).json({
            message: 'Library name is required',
          });
        }

        if (!libraryLink && !libraryFile) {
          return res.status(400).json({
            message: 'Library link or file is required',
          });
        }
      }

      // لو مش Scan Body
      else {
        if (libraryName || libraryLink || libraryFile) {
          return res.status(400).json({
            message: 'Library data only allowed with Scan Body Library',
          });
        }
      }
    }

    // =========================
    // VENEER
    // =========================

    if (caseExist.caseType === CaseType.VENEER) {
      if (units > 1 && !connectionType) {
        return res.status(400).json({
          message: 'Multiple veneers require connection type',
        });
      }
    }

    // =========================
    // CUSTOM ABUTMENT
    // =========================

    if (caseExist.caseType === CaseType.CUSTOM_ABUTMENT) {
      if (!implantType) {
        return res.status(400).json({
          message: 'Custom abutment requires implant type',
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: 'Validation error',
      error,
    });
  }
};
