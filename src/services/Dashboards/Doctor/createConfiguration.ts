import { ClientSession } from "mongoose";
import CaseConfiguration from "../../../models/CaseConfiguration";

export const createCaseConfiguration = async (
  caseId: string,
  body: any,
  session: ClientSession
) => {
  const [configuration] = await CaseConfiguration.create(
    [
      {
        case: caseId,
        units: body.units,
        selectedTeeth: body.selectedTeeth,
        restorationDesign: body.restorationDesignType,
        connectionType: body.connectionType,
        implantType: body.implantType,
        implantRestoration: body.implantRestoration,
        libraryName: body.libraryName,
        libraryLink: body.libraryLink,
        libraryFile: body.libraryFile,
      },
    ],
    { session }
  );

  return configuration;
};