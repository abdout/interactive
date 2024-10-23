// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/db'; // Adjust the path as needed
import { User } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure that the request method is GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await useSession({ req });

  // Check if the user is authenticated
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  // Ensure the ID in the URL matches the authenticated user's ID
  if (session.user.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Fetch the full user data from the database
    const user: User | null = await db.user.findUnique({
      where: { id: id as string },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
