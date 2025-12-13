import styled from "@emotion/styled";

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.5rem;
  border: 0.25rem solid #000;
  background-color: var(--color-accent-100);
  padding: 2rem;

  .input-group {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;

    fieldset {
      border-radius: 1rem;
    }
  }

  @media (max-width: 48rem) {
    .input-group {
      fieldset {
        width: 100%;
      }
      flex-direction: column;
    }
  }
`;
