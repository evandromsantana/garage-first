module.exports = [
"[project]/garage-ninja/src/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
(()=>{
    const e = new Error("Cannot find module '@/generated/prisma'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40353495e714f5f8f655cafba0d47a1269b380dd75":{"name":"getVehicleWithData"},"4040db501bab65a54e3ebd71f119bd650e689656c0":{"name":"getPendingMaintenance"},"4072007402a2b7efd9ab4f4dda27161a780de02616":{"name":"searchTechnicalSpecs"},"408dfc8f7e53c71a47f2f633d3434c219b79d81359":{"name":"createMaintenanceLog"},"600b97f28cf406f7dfe0ea19e0206f3d29d7c8861f":{"name":"updateVehicleKm"},"60d3f50590d29093d21d7ec1e3de7921469fab0405":{"name":"updateMaintenanceStatus"},"7873503b2e7020d0cca1f72b2c79a4b50858ee85d8":{"name":"createMaintenanceExpense"}},"garage-ninja/src/app/actions.ts",""] */ __turbopack_context__.s([
    "createMaintenanceExpense",
    ()=>createMaintenanceExpense,
    "createMaintenanceLog",
    ()=>createMaintenanceLog,
    "getPendingMaintenance",
    ()=>getPendingMaintenance,
    "getVehicleWithData",
    ()=>getVehicleWithData,
    "searchTechnicalSpecs",
    ()=>searchTechnicalSpecs,
    "updateMaintenanceStatus",
    ()=>updateMaintenanceStatus,
    "updateVehicleKm",
    ()=>updateVehicleKm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function updateVehicleKm(vehicleId, newKm) {
    const vehicle = await __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].vehicle.update({
        where: {
            id: vehicleId
        },
        data: {
            currentKm: newKm
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
    return vehicle;
}
async function createMaintenanceExpense(maintenanceId, itemName, itemCost, isOriginalPart = false) {
    const expense = await __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].projectExpense.create({
        data: {
            maintenanceId,
            itemName,
            itemCost,
            isOriginalPart
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
    return expense;
}
async function updateMaintenanceStatus(maintenanceId, status) {
    const maintenance = await __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].maintenanceLog.update({
        where: {
            id: maintenanceId
        },
        data: {
            status
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
    return maintenance;
}
async function createMaintenanceLog(data) {
    const maintenance = await __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].maintenanceLog.create({
        data: {
            vehicleId: data.vehicleId,
            type: data.type,
            description: data.description,
            kmAtService: data.kmAtService,
            cost: data.cost,
            diagramCode: data.diagramCode,
            status: 'PENDING'
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
    return maintenance;
}
async function getVehicleWithData(vehicleId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].vehicle.findUnique({
        where: {
            id: vehicleId
        },
        include: {
            maintenanceLogs: {
                include: {
                    expenses: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
}
async function getPendingMaintenance(vehicleId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].maintenanceLog.findMany({
        where: {
            vehicleId,
            status: 'PENDING'
        },
        include: {
            expenses: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
async function searchTechnicalSpecs(query) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].technicalSpec.findMany({
        where: {
            OR: [
                {
                    component: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    category: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                {
                    notes: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateVehicleKm,
    createMaintenanceExpense,
    updateMaintenanceStatus,
    createMaintenanceLog,
    getVehicleWithData,
    getPendingMaintenance,
    searchTechnicalSpecs
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateVehicleKm, "600b97f28cf406f7dfe0ea19e0206f3d29d7c8861f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createMaintenanceExpense, "7873503b2e7020d0cca1f72b2c79a4b50858ee85d8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateMaintenanceStatus, "60d3f50590d29093d21d7ec1e3de7921469fab0405", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createMaintenanceLog, "408dfc8f7e53c71a47f2f633d3434c219b79d81359", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getVehicleWithData, "40353495e714f5f8f655cafba0d47a1269b380dd75", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingMaintenance, "4040db501bab65a54e3ebd71f119bd650e689656c0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchTechnicalSpecs, "4072007402a2b7efd9ab4f4dda27161a780de02616", null);
}),
"[project]/garage-ninja/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/garage-ninja/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40353495e714f5f8f655cafba0d47a1269b380dd75",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVehicleWithData"],
    "4040db501bab65a54e3ebd71f119bd650e689656c0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPendingMaintenance"],
    "4072007402a2b7efd9ab4f4dda27161a780de02616",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchTechnicalSpecs"],
    "408dfc8f7e53c71a47f2f633d3434c219b79d81359",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMaintenanceLog"],
    "600b97f28cf406f7dfe0ea19e0206f3d29d7c8861f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateVehicleKm"],
    "60d3f50590d29093d21d7ec1e3de7921469fab0405",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMaintenanceStatus"],
    "7873503b2e7020d0cca1f72b2c79a4b50858ee85d8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMaintenanceExpense"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/garage-ninja/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$garage$2d$ninja$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/garage-ninja/src/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=garage-ninja_0b~f1_4._.js.map