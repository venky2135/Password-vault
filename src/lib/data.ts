export interface VaultItem {
    id: string;
    title: string;
    username: string;
    password: string; // In a real app, this would be encrypted before being sent to the server.
    url: string;
    notes: string;
    lastModified: string;
  }
  
  const mockData: VaultItem[] = [
    {
      id: "1",
      title: "Google",
      username: "john.doe@gmail.com",
      password: "veryStrongPassword123!",
      url: "https://google.com",
      notes: "Main google account for services.",
      lastModified: "2 days ago",
    },
    {
      id: "2",
      title: "GitHub",
      username: "johndoe",
      password: "anotherSecurePassword#$%",
      url: "https://github.com",
      notes: "Personal GitHub account.",
      lastModified: "5 days ago",
    },
    {
        id: "3",
        title: "Twitter / X",
        username: "@johndoe",
        password: "socialMediaPassword1!",
        url: "https://x.com",
        notes: "",
        lastModified: "1 week ago",
    },
    {
        id: "4",
        title: "Figma",
        username: "john.doe@design.co",
        password: "designToolPass!@#",
        url: "https://figma.com",
        notes: "Work account for design projects.",
        lastModified: "2 weeks ago",
    },
    {
        id: "5",
        title: "AWS Console",
        username: "aws-admin-jd",
        password: "cloudInfrastructurePass*()",
        url: "https://aws.amazon.com",
        notes: "Root access. Use with caution.",
        lastModified: "1 month ago",
    },
  ];
  
  // In a real application, these functions would interact with a database.
  // We use mock data here for demonstration.
  
  export const getVaultItems = (): VaultItem[] => {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    return mockData;
  };
  
  export const getVaultItemById = (id: string): VaultItem | undefined => {
    return mockData.find(item => item.id === id);
  };
  
  // Note on Client-Side Encryption:
  // In a real-world scenario, the `password` and `notes` fields would be encrypted on the client
  // before being sent to the server for storage. Libraries like `crypto-js` or the browser's
  // built-in `SubtleCrypto` API are excellent choices for this. A master password, known only to the user,
  // would be used to derive an encryption key. This ensures that even if the database is
  // compromised, the user's sensitive data remains secure and unreadable.
  