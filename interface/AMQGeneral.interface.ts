
// PatreonChanged
export interface IAMQPatreonChanged {
    backerLevel: number;
    badgeLevel: number;
    freeDonation: number;
    nameChangeTokens: number;
    patreonBadgeInfo: {
        current: {
            fileName: string;
            id: number;
            name: string;
            special: boolean
            type: number;
            unlockDescription: string;
        };
        next: {
            fileName: string;
            id: number;
            name: string;
            special: boolean
            type: number;
            unlockDescription: string;
        };
    };
    patreonId: string;
    usersCustomEmojis: any[];
}

// TicketUpdate
export interface IAMQTicketUpdate {
    tickets: number;
}

