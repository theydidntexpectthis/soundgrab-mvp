import { z } from "zod";
export declare const users: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "users";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        username: import("drizzle-orm/pg-core").PgColumn<{
            name: "username";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        password: import("drizzle-orm/pg-core").PgColumn<{
            name: "password";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export interface Track {
    id: string;
    videoId: string;
    title: string;
    artist: string;
    thumbnailUrl?: string;
    duration: number;
    views: number;
    description?: string;
    publishDate?: string;
    lyrics?: string;
    audioUrl?: string;
    previewUrl?: string;
}
export interface SearchResult {
    mainResult: Track;
    otherResults: Track[];
}
export interface SearchHistory {
    id: string;
    query: string;
    timestamp: Date;
    results: Track[];
    track?: Track;
}
export interface Download {
    id: string;
    track: Track;
    title: string;
    artist: string;
    progress: number;
    status: 'queued' | 'downloading' | 'processing' | 'completed' | 'error';
    error?: string;
    startTime: Date;
    completedTime?: Date;
    fileSize?: number;
    downloadedBytes?: number;
    totalBytes?: number;
    filePath?: string;
    fileName?: string;
}
//# sourceMappingURL=schema.d.ts.map