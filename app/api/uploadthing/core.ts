// UploadThing v7 file router. Only admins may upload — auth binds to this
// middleware, not to the route being reachable, matching the DAL pattern in
// lib/dal.ts.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { verifySession } from "@/lib/dal";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async () => {
      const user = await verifySession();
      if (!user?.email) throw new UploadThingError("Unauthorized");
      return { adminEmail: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[uploadthing] ${metadata.adminEmail} uploaded ${file.ufsUrl}`);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
