export interface UserInfo {
    uid: string;
    role: string;
    email: string;
    adminId: string;
    answers?: boolean[];
    invitationCode: string;
    lastTestDate?:Date;
    personalInfo:{
        apellidos: string;
        carrera: string;
        ciclo: string;
        departamento: string;
        edad: number;
        nombres: string;
        sexo: string;
        universidad: string;
    }
    testDuration?: number;
    testResults?: {
        academico: Results;
        fisico: Results;
        personal: Results;
        social: Results;
    };
    veracityScore?:number;
    hasRetakenTest?:boolean;
}
export interface Results{
    level:string;
    score:number;
}