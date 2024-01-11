import styled, {css} from "styled-components";
import { primary } from "@/lib/colors";

export const ButtonStyle = css`
    font-size: 1rem;
    border: 0;
    padding: 5px 15px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    svg {
        height: 16px;
        margin-right: 5px;
    }
    ${props => props.white && !props.outline && css`
        background-color: #fff;
        color: #000;
    `}
    ${props => props.white && props.outline && css`
        background-color: transparent;
        color: #fff;
        border: 1px solid #fff;
    `}
    ${props => props.primary && !props.outline && css`
        background-color: ${primary};
        border: 1px solid ${primary};
        color: #fff;
    `}
    ${props => props.primary && props.outline && css`
        background-color: #transparent;
        border: 1px solid #111;
        color: #111;
        display: block;
        width: 100%;
        font-size: .9rem;
        border-radius: 16px;
        &:hover {
            background-color: #222;
            border: 1px solid #222;
            color: #fff;
            transition: .4s;
        }
    `}
    ${props => props.size === 'l' && css`
        font-size: 1.2rem;
        padding: 10px 20px;
        svg {
            height: 20px;
        }
    `}
    ${props => props.white && props.print && css`
        color: #111;
        border: 1px solid #111;
    `}
`;

export const StyledButton = styled.button`
    ${ButtonStyle}
`;

export default function Button({children,...rest}) {
    return (
        <StyledButton {...rest}>{children}</StyledButton>
    );
}