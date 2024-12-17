// this is to push sample data into db
import { db } from "./db.js";
import { UserRole } from "@prisma/client";

const sampleUsers = [
	{
		id: 1,
		email: "p4@xxx.com",
		name: "P4Priyanshi",
		role: UserRole.CLIENT,
		wallet: {
			id: 500,
			userId: 1,
			tokens: [
				{
					id: 1000,
					walletId: 500,
					tokenId: 2000,
					quantity: 34.0,
				},
				{
					id: 1001,
					walletId: 500,
					tokenId: 2001,
					quantity: 7.5,
				},
			],
		},
	},
	{
		id: 2,
		email: "ronak@raonakno1.com",
		name: "Roank",
		role: UserRole.CLIENT,
		wallet: {
			id: 501,
			userId: 2,
			tokens: [
				{
					id: 1003,
					walletId: 501,
					tokenId: 2000,
					quantity: 4.0,
				},
				{
					id: 1004,
					walletId: 501,
					tokenId: 2001,
					quantity: 90.0,
				},
			],
		},
	},
	{
		id: 3,
		email: "aryav@bhola.com",
		name: "Lord Aryav",
		role: UserRole.MANAGER,
	},
];

function pushSampleData() {
	sampleUsers.forEach(async (sampleUser) => {
		if (sampleUser.role === UserRole.CLIENT) {
			const wallet = await db.wallet.create({
				data: {
					userId: sampleUser.id,
				},
			});

			await db.walletToken.createMany({ data: sampleUser.wallet.tokens });

			await db.user.create({
				data: {
					id: sampleUser.id,
					email: sampleUser.email,
					name: sampleUser.name,
					role: sampleUser.role,
					walletId: wallet.id,
				},
			});
		} else {
			await db.user.create({
				data: {
					id: sampleUser.id,
					email: sampleUser.email,
					name: sampleUser.name,
					role: sampleUser.role,
				},
			});
		}
	});
}

export { pushSampleData };
