// 공용 인터페이스 정의

export interface Role {
    name: string;
    description: string;
  }
  
  export interface Data {
    name: string;
    description: string;
    headCount: number;
    matchingType: string;
    point: number;
    visibility: boolean;
    password: string;
    todos: Role[];
  }

  export interface TodoRoom{
    id: number;
    name: string;
    description: string;
    headCount: number;
    matchingType: string;
    point: number;
    visibility: boolean;
    password: string;
    todos: Role[];
  }
  