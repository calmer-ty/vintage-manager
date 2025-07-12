export const getNowString = () => {
  return new Date().toISOString(); // 호출할 때마다 현재 시간 문자열 리턴
};
