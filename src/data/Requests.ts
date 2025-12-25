import type { Request } from '@/interfaces/Request.interface';

const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    tenantId: 'TEN-001',
    tenantName: 'Fashion Boutique',
    title: 'AC Not Cooling',
    description:
      'The air conditioning unit in the main showroom is not cooling properly. It is getting very hot for customers.',
    status: 'Pending',
    images: [
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-10-25T10:00:00Z',
  },
  {
    id: 'REQ-002',
    tenantId: 'TEN-002',
    tenantName: 'Tech Gadgets Store',
    title: 'Leaking Pipe in Storage',
    description:
      'There is a small leak in the water pipe running through our back storage room.',
    status: 'In Progress',
    images: [],
    createdAt: '2023-10-24T14:30:00Z',
    updatedAt: '2023-10-25T09:15:00Z',
  },
  {
    id: 'REQ-003',
    tenantId: 'TEN-003',
    tenantName: 'Coffee Corner',
    title: 'Broken Door Handle',
    description:
      'The main entrance door handle is loose and about to fall off.',
    status: 'Resolved',
    images: [
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
    createdAt: '2023-10-20T08:00:00Z',
    updatedAt: '2023-10-22T16:45:00Z',
  },
  {
    id: 'REQ-004',
    tenantId: 'TEN-001',
    tenantName: 'Fashion Boutique',
    title: 'Request for Extra Cleaning',
    description:
      'We had a spill in the fitting room area and need deep cleaning.',
    status: 'Pending',
    images: [],
    createdAt: '2023-10-26T11:20:00Z',
    updatedAt: '2023-10-26T11:20:00Z',
  },
  {
    id: 'REQ-005',
    tenantId: 'TEN-004',
    tenantName: 'Book Worms',
    title: 'Power Outage in Section B',
    description:
      "The lights in the children's book section are flickering and going out.",
    status: 'Pending',
    images: [],
    createdAt: '2023-10-26T09:00:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
  },
];

export const fetchMockRequests = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  status: string = 'All'
): Promise<{ data: Request[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockRequests];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(lowerSearch) ||
            r.tenantName.toLowerCase().includes(lowerSearch) ||
            r.id.toLowerCase().includes(lowerSearch)
        );
      }

      if (status && status !== 'All') {
        filtered = filtered.filter((r) => r.status === status);
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const data = filtered.slice(start, end);

      resolve({
        data,
        total: filtered.length,
      });
    }, 800); // Simulate network delay
  });
};

export const fetchMockRequestById = async (
  id: string
): Promise<Request | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = mockRequests.find((r) => r.id === id);
      if (request) {
        resolve(request);
      } else {
        reject(new Error('Request not found'));
      }
    }, 500);
  });
};

