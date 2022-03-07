export default interface FilterModel
{
    key: string;
    comparator: string;
    operation: "=="| "!=" | ">"| "<" | ">=" | "<=";
}