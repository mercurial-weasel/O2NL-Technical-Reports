-- CreateEnum
CREATE TYPE "DisciplineType" AS ENUM ('AMT', 'Design', 'Construction', 'Legacy_Outcomes', 'Engineering', 'Other');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Green', 'Amber', 'Red');

-- CreateEnum
CREATE TYPE "RiskChange" AS ENUM ('Unknown', 'Unchanged', 'Up', 'Down');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('green', 'orange', 'red');

-- CreateEnum
CREATE TYPE "Trend" AS ENUM ('up', 'down', 'unchanged');

-- CreateEnum
CREATE TYPE "SustainabilityThemeType" AS ENUM ('Emissions', 'Energy', 'Water', 'Waste_Recovery', 'Materials', 'Sustainable_Procurement', 'Nature', 'Legacy', 'General', 'Resilience');

-- CreateEnum
CREATE TYPE "SustainabilityStatusType" AS ENUM ('Proposed', 'Pending', 'Delayed', 'Implemented');

-- CreateEnum
CREATE TYPE "SustainabilityPriorityType" AS ENUM ('5 - Very High', '4 - High', '3 - Medium', '2 - Low', '1 - Very Low');

-- CreateEnum
CREATE TYPE "SustainabilityProcessType" AS ENUM ('Process', 'Outcome', 'Process / Outcome');

-- CreateEnum
CREATE TYPE "SustainabilityRequirementType" AS ENUM ('Must', 'Should');

-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('operational', 'maintenance', 'degraded', 'outage', 'not_started');

-- CreateEnum
CREATE TYPE "BusinessArea" AS ENUM ('00 - Commercial', '01 - Design', '02 - Engineering', '03 - IT', '04 - Fitout', '05 - Environmental', '06 - HSEQ', '07 - Stakeholder', '09 - Home Org', '10 - Project Controls');

-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('0 - IPAA', '1- PAA', '2 - IPAA + PAA');

-- CreateEnum
CREATE TYPE "Requirement" AS ENUM ('0 - Must have', '1 - Would Have', '2 - Could Have', '3 - Wont Have', '9 - Unknown');

-- CreateEnum
CREATE TYPE "Adoption" AS ENUM ('1 - poor', '2 - average', '3 - good', '4 - very good', '5 - comprehensive', '7 - Unknown', '8 - Not commenced', '9 - N/A');

-- CreateEnum
CREATE TYPE "HostedBy" AS ENUM ('THIRD_PARTY', 'MACDOW', 'TT', 'NZTA', 'BECA', 'HOME_ORG', 'UNKNOWN');

-- CreateTable
CREATE TABLE "AMTMonthlyRecord" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "discipline" "DisciplineType" NOT NULL,
    "status" "Status" NOT NULL,
    "trend" "Trend" NOT NULL,
    "keyIssue" TEXT NOT NULL,
    "dependencies" TEXT[],
    "metrics" JSONB NOT NULL,
    "notes" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "AMTMonthlyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AMTBudgetItem" (
    "id" TEXT NOT NULL,
    "workstream" TEXT NOT NULL,
    "hours1" DOUBLE PRECISION NOT NULL,
    "total1" DOUBLE PRECISION NOT NULL,
    "hours2" DOUBLE PRECISION NOT NULL,
    "total2" DOUBLE PRECISION NOT NULL,
    "hoursDiff" DOUBLE PRECISION NOT NULL,
    "totalDiff" DOUBLE PRECISION NOT NULL,
    "monthlyBudgetDataId" TEXT,

    CONSTRAINT "AMTBudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetSummary" (
    "id" TEXT NOT NULL,
    "totalLabourHours1" DOUBLE PRECISION NOT NULL,
    "totalLabourTotal1" DOUBLE PRECISION NOT NULL,
    "totalLabourHours2" DOUBLE PRECISION NOT NULL,
    "totalLabourTotal2" DOUBLE PRECISION NOT NULL,
    "totalLabourHoursDiff" DOUBLE PRECISION NOT NULL,
    "totalLabourTotalDiff" DOUBLE PRECISION NOT NULL,
    "totalExpensesTotal1" DOUBLE PRECISION NOT NULL,
    "totalExpensesTotal2" DOUBLE PRECISION NOT NULL,
    "totalExpensesTotalDiff" DOUBLE PRECISION NOT NULL,
    "totalAllHours1" DOUBLE PRECISION NOT NULL,
    "totalAllTotal1" DOUBLE PRECISION NOT NULL,
    "totalAllHours2" DOUBLE PRECISION NOT NULL,
    "totalAllTotal2" DOUBLE PRECISION NOT NULL,
    "totalAllHoursDiff" DOUBLE PRECISION NOT NULL,
    "totalAllTotalDiff" DOUBLE PRECISION NOT NULL,
    "monthlyBudgetDataId" TEXT,

    CONSTRAINT "BudgetSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyBudgetData" (
    "id" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "amtBudgetDataId" TEXT,

    CONSTRAINT "MonthlyBudgetData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AMTBudgetData" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AMTBudgetData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAssessment" (
    "id" TEXT NOT NULL,
    "designChange" TEXT NOT NULL,
    "proposedConsentPathway" TEXT NOT NULL,
    "currentRiskLevel" "RiskLevel" NOT NULL,
    "comments" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "riskChange" "RiskChange" NOT NULL,
    "consentMonthId" TEXT,

    CONSTRAINT "ConsentAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentMonth" (
    "id" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "totalAssessments" INTEGER NOT NULL,
    "greenRiskCount" INTEGER NOT NULL,
    "amberRiskCount" INTEGER NOT NULL,
    "redRiskCount" INTEGER NOT NULL,

    CONSTRAINT "ConsentMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DustChild" (
    "id" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "dustLevel" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "pm10" DOUBLE PRECISION NOT NULL,
    "pm2_5" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "windDirection" DOUBLE PRECISION NOT NULL,
    "complianceStatus" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "remarks" TEXT,
    "dustParentId" TEXT,

    CONSTRAINT "DustChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DustParent" (
    "id" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceModel" TEXT,
    "serialNumber" TEXT,
    "manufacturer" TEXT,
    "organisation" TEXT,
    "remarks" TEXT,
    "timeStamp" TIMESTAMP(3),
    "deviceStatus" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "dustDataId" TEXT,

    CONSTRAINT "DustParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DustData" (
    "id" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "totalReadings" INTEGER NOT NULL,

    CONSTRAINT "DustData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "planned" DOUBLE PRECISION NOT NULL,
    "earned" DOUBLE PRECISION NOT NULL,
    "projectElementId" TEXT,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectElement" (
    "id" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "directCosts" DOUBLE PRECISION NOT NULL,
    "limb2" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "noOfMonths" INTEGER NOT NULL,
    "planStart" TEXT NOT NULL,
    "planFinish" TEXT NOT NULL,
    "percentWgtOfBudget" DOUBLE PRECISION NOT NULL,
    "earnedValueDataId" TEXT,

    CONSTRAINT "ProjectElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarnedValueData" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EarnedValueData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmissionRecord" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "carbonEstimateKgCO2e" DOUBLE PRECISION NOT NULL,
    "emissionsDataId" TEXT,

    CONSTRAINT "EmissionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryConversion" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "conversionFactor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CategoryConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmissionsData" (
    "id" TEXT NOT NULL,
    "totalCarbonEstimate" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmissionsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentStatus" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "easting" DOUBLE PRECISION NOT NULL,
    "northing" DOUBLE PRECISION NOT NULL,
    "lastUpdatedDate" TEXT NOT NULL,
    "lastUpdatedTime" TEXT NOT NULL,
    "elevation" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "keyMetrics" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "measurementType" TEXT NOT NULL,
    "alertDate" TEXT,
    "alertTime" TEXT,
    "alertComments" TEXT,
    "equipmentTypeId" TEXT,

    CONSTRAINT "EquipmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentType" (
    "id" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "equipmentDataId" TEXT,

    CONSTRAINT "EquipmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentData" (
    "id" TEXT NOT NULL,
    "lastUpdated" TEXT NOT NULL,

    CONSTRAINT "EquipmentData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SieveItem" (
    "id" TEXT NOT NULL,
    "sieve_size_mm" DOUBLE PRECISION NOT NULL,
    "percent_passing" DOUBLE PRECISION NOT NULL,
    "testId" TEXT,

    CONSTRAINT "SieveItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticleSizeDistributionTest" (
    "id" TEXT NOT NULL,
    "adit_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "depth_to" DOUBLE PRECISION NOT NULL,
    "sample_reference" TEXT NOT NULL,
    "sample_type" TEXT NOT NULL,
    "date_sampled" TEXT NOT NULL,
    "sample_unique_id" TEXT NOT NULL,
    "test_no" INTEGER NOT NULL,
    "date_tested" TEXT NOT NULL,
    "date_checked" TEXT NOT NULL,
    "date_approved" TEXT NOT NULL,
    "remark_dot_test_remarks" TEXT NOT NULL,
    "average_water_content" TEXT NOT NULL,
    "superseeding_note" TEXT,
    "chainage" DOUBLE PRECISION NOT NULL,
    "distance_to_alignment" DOUBLE PRECISION NOT NULL,
    "angle_to_alignment_deg_cc" DOUBLE PRECISION NOT NULL,
    "construction_subzone" TEXT NOT NULL,
    "x_coordinate" DOUBLE PRECISION NOT NULL,
    "y_coordinate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticleSizeDistributionTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PSDData" (
    "id" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PSDData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetItem" TEXT NOT NULL,
    "shared" DOUBLE PRECISION,
    "nonShared" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "ref" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "movementShared" DOUBLE PRECISION,
    "movementNonShared" DOUBLE PRECISION,
    "movementTotal" DOUBLE PRECISION,
    "highlight" BOOLEAN NOT NULL,
    "budgetDataId" TEXT,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetData" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "BudgetData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "shared" DOUBLE PRECISION,
    "nonShared" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "ref" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "movementShared" DOUBLE PRECISION,
    "movementNonShared" DOUBLE PRECISION,
    "movementTotal" DOUBLE PRECISION,
    "highlight" BOOLEAN NOT NULL,
    "costDataId" TEXT,

    CONSTRAINT "CostItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostData" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "CostData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostIndicator" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "textColor" TEXT,
    "indicatorsId" TEXT,

    CONSTRAINT "CostIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostIndicators" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "CostIndicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskIndicator" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "indicatorsId" TEXT,

    CONSTRAINT "RiskIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskIndicators" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "RiskIndicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenditureData" (
    "id" TEXT NOT NULL,
    "months" TEXT[],
    "plannedMonthly" DOUBLE PRECISION[],
    "plannedCumulative" DOUBLE PRECISION[],
    "actualMonthly" DOUBLE PRECISION[],
    "actualCumulative" DOUBLE PRECISION[],
    "forecastMonthly" DOUBLE PRECISION[],
    "forecastCumulative" DOUBLE PRECISION[],
    "recordId" TEXT,

    CONSTRAINT "ExpenditureData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenditureIndicator" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "textColor" TEXT,
    "indicatorsId" TEXT,

    CONSTRAINT "ExpenditureIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenditureIndicators" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "ExpenditureIndicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingShare" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currentMonthId" TEXT,
    "projectSplitId" TEXT,

    CONSTRAINT "FundingShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingSplitData" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "FundingSplitData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Limb1Indicator" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "textColor" TEXT,
    "indicatorsId" TEXT,

    CONSTRAINT "Limb1Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Limb1Indicators" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "Limb1Indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Limb3Indicator" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "textColor" TEXT,
    "indicatorsId" TEXT,

    CONSTRAINT "Limb3Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Limb3Indicators" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "Limb3Indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPABRecord" (
    "id" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MonthlyPABRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PABResponse" (
    "id" TEXT NOT NULL,
    "currentMonthId" TEXT NOT NULL,
    "availableMonths" TEXT[],
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PABResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "O2NL_Staff" (
    "id" TEXT NOT NULL,
    "disciplineManager" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "nopType" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "projectRoleTitle" TEXT NOT NULL,
    "jobCode" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdatedConf" TEXT NOT NULL,
    "resourceOptions" TEXT NOT NULL,
    "taitokoLevinSiteBased" TEXT NOT NULL,
    "pricingPGProfDirectWorks" TEXT NOT NULL,
    "fteAve" DOUBLE PRECISION NOT NULL,
    "requiredStart" TIMESTAMP(3) NOT NULL,
    "requiredFinish" TIMESTAMP(3) NOT NULL,
    "monthlyFTE" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "O2NL_Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "likelihood" SMALLINT NOT NULL,
    "consequence" SMALLINT NOT NULL,
    "owner" TEXT,
    "mitigations" TEXT[],
    "recordId" TEXT,
    "amtRecordId" TEXT,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completion" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "critical_path" BOOLEAN NOT NULL,
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "recordId" TEXT,
    "amtRecordId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "trend" "Trend" NOT NULL,
    "status" "Status" NOT NULL,
    "recordId" TEXT,
    "amtRecordId" TEXT,

    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SustainabilityMonthlyRecord" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "trend" "Trend" NOT NULL,
    "keyIssue" TEXT NOT NULL,
    "dependencies" TEXT[],
    "metrics" JSONB NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SustainabilityMonthlyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SustainabilityInitiative" (
    "id" TEXT NOT NULL,
    "theme" "SustainabilityThemeType" NOT NULL,
    "outcome" TEXT NOT NULL,
    "status" "SustainabilityStatusType" NOT NULL,
    "priority" "SustainabilityPriorityType" NOT NULL,
    "target" TEXT NOT NULL,
    "measure" TEXT,
    "dataType" TEXT,
    "unit" TEXT,
    "parameters" TEXT,
    "reportingApproach" TEXT,
    "processOrOutcome" "SustainabilityProcessType" NOT NULL,
    "mustOrShould" "SustainabilityRequirementType" NOT NULL,
    "measurementMethod" TEXT,
    "notes" TEXT,
    "measureOwner" TEXT,
    "evidence" TEXT,
    "targetDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SustainabilityInitiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemData" (
    "id" TEXT NOT NULL,
    "businessArea" "BusinessArea" NOT NULL,
    "category" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "requirement" "Requirement" NOT NULL,
    "phase" "Phase" NOT NULL,
    "licence" TEXT NOT NULL,
    "smeResponsible" TEXT NOT NULL,
    "projectRole" TEXT NOT NULL,
    "adoption" "Adoption" NOT NULL,
    "hostedBy" "HostedBy" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLogEntry" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "hourData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoursResponse" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HoursResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AMTBudgetItem_monthlyBudgetDataId_key" ON "AMTBudgetItem"("monthlyBudgetDataId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetSummary_monthlyBudgetDataId_key" ON "BudgetSummary"("monthlyBudgetDataId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticleSizeDistributionTest_sample_unique_id_key" ON "ParticleSizeDistributionTest"("sample_unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetData_recordId_key" ON "BudgetData"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "CostData_recordId_key" ON "CostData"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "CostIndicators_recordId_key" ON "CostIndicators"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskIndicators_recordId_key" ON "RiskIndicators"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenditureData_recordId_key" ON "ExpenditureData"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenditureIndicators_recordId_key" ON "ExpenditureIndicators"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingSplitData_recordId_key" ON "FundingSplitData"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Limb1Indicators_recordId_key" ON "Limb1Indicators"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Limb3Indicators_recordId_key" ON "Limb3Indicators"("recordId");

-- AddForeignKey
ALTER TABLE "AMTBudgetItem" ADD CONSTRAINT "AMTBudgetItem_monthlyBudgetDataId_fkey" FOREIGN KEY ("monthlyBudgetDataId") REFERENCES "MonthlyBudgetData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetSummary" ADD CONSTRAINT "BudgetSummary_monthlyBudgetDataId_fkey" FOREIGN KEY ("monthlyBudgetDataId") REFERENCES "MonthlyBudgetData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyBudgetData" ADD CONSTRAINT "MonthlyBudgetData_amtBudgetDataId_fkey" FOREIGN KEY ("amtBudgetDataId") REFERENCES "AMTBudgetData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAssessment" ADD CONSTRAINT "ConsentAssessment_consentMonthId_fkey" FOREIGN KEY ("consentMonthId") REFERENCES "ConsentMonth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DustChild" ADD CONSTRAINT "DustChild_dustParentId_fkey" FOREIGN KEY ("dustParentId") REFERENCES "DustParent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DustParent" ADD CONSTRAINT "DustParent_dustDataId_fkey" FOREIGN KEY ("dustDataId") REFERENCES "DustData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_projectElementId_fkey" FOREIGN KEY ("projectElementId") REFERENCES "ProjectElement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectElement" ADD CONSTRAINT "ProjectElement_earnedValueDataId_fkey" FOREIGN KEY ("earnedValueDataId") REFERENCES "EarnedValueData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionRecord" ADD CONSTRAINT "EmissionRecord_emissionsDataId_fkey" FOREIGN KEY ("emissionsDataId") REFERENCES "EmissionsData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentStatus" ADD CONSTRAINT "EquipmentStatus_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "EquipmentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentType" ADD CONSTRAINT "EquipmentType_equipmentDataId_fkey" FOREIGN KEY ("equipmentDataId") REFERENCES "EquipmentData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SieveItem" ADD CONSTRAINT "SieveItem_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ParticleSizeDistributionTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetDataId_fkey" FOREIGN KEY ("budgetDataId") REFERENCES "BudgetData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetData" ADD CONSTRAINT "BudgetData_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostItem" ADD CONSTRAINT "CostItem_costDataId_fkey" FOREIGN KEY ("costDataId") REFERENCES "CostData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostData" ADD CONSTRAINT "CostData_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostIndicator" ADD CONSTRAINT "CostIndicator_indicatorsId_fkey" FOREIGN KEY ("indicatorsId") REFERENCES "CostIndicators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostIndicators" ADD CONSTRAINT "CostIndicators_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskIndicator" ADD CONSTRAINT "RiskIndicator_indicatorsId_fkey" FOREIGN KEY ("indicatorsId") REFERENCES "RiskIndicators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskIndicators" ADD CONSTRAINT "RiskIndicators_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureData" ADD CONSTRAINT "ExpenditureData_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureIndicator" ADD CONSTRAINT "ExpenditureIndicator_indicatorsId_fkey" FOREIGN KEY ("indicatorsId") REFERENCES "ExpenditureIndicators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureIndicators" ADD CONSTRAINT "ExpenditureIndicators_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingShare" ADD CONSTRAINT "FundingShare_currentMonthId_fkey" FOREIGN KEY ("currentMonthId") REFERENCES "FundingSplitData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingShare" ADD CONSTRAINT "FundingShare_projectSplitId_fkey" FOREIGN KEY ("projectSplitId") REFERENCES "FundingSplitData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingSplitData" ADD CONSTRAINT "FundingSplitData_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Limb1Indicator" ADD CONSTRAINT "Limb1Indicator_indicatorsId_fkey" FOREIGN KEY ("indicatorsId") REFERENCES "Limb1Indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Limb1Indicators" ADD CONSTRAINT "Limb1Indicators_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Limb3Indicator" ADD CONSTRAINT "Limb3Indicator_indicatorsId_fkey" FOREIGN KEY ("indicatorsId") REFERENCES "Limb3Indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Limb3Indicators" ADD CONSTRAINT "Limb3Indicators_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MonthlyPABRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PABResponse" ADD CONSTRAINT "PABResponse_currentMonthId_fkey" FOREIGN KEY ("currentMonthId") REFERENCES "MonthlyPABRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "SustainabilityMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_amtRecordId_fkey" FOREIGN KEY ("amtRecordId") REFERENCES "AMTMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "SustainabilityMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_amtRecordId_fkey" FOREIGN KEY ("amtRecordId") REFERENCES "AMTMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPI" ADD CONSTRAINT "KPI_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "SustainabilityMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPI" ADD CONSTRAINT "KPI_amtRecordId_fkey" FOREIGN KEY ("amtRecordId") REFERENCES "AMTMonthlyRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
