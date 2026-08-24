/**
 * Server Action의 폼 상태 타입.
 * "use server" 파일은 async 함수만 export할 수 있으므로 값/타입은 여기에 둡니다.
 */
export type ActionState = { error: string | null };

export const initialActionState: ActionState = { error: null };
