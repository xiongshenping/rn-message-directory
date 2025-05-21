export interface Group {
    id: string;
    name: string;
}

export interface Msg {
    id: string;
    groupId: string;
    title: string;
    content: string;
    createdAt: string;
}