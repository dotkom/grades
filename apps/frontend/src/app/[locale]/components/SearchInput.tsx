import { cn, InputGroup, TextField } from "@heroui/react"
import { IconSearch } from "@tabler/icons-react"
import type { ComponentProps } from "react"

/** Shared field chrome height for Search + ComboBox — colors come from --field-* tokens. */
export const searchFieldGroupClassName = "h-9"

type SearchInputProps = Omit<ComponentProps<"input">, "size"> & {
  inputClassName?: string
}

export const SearchInput = ({
  className,
  inputClassName,
  "aria-label": ariaLabel,
  placeholder,
  ref,
  ...props
}: SearchInputProps) => {
  return (
    <TextField aria-label={ariaLabel ?? placeholder ?? "Search"} className={cn("min-w-0", className)} fullWidth>
      <InputGroup className={cn(searchFieldGroupClassName, "min-w-0 overflow-hidden", inputClassName)} fullWidth>
        <InputGroup.Prefix className="border-e-0!">
          <IconSearch className="size-4 shrink-0" aria-hidden />
        </InputGroup.Prefix>
        <InputGroup.Input
          ref={ref}
          className="h-full min-h-0 min-w-0 overflow-hidden text-ellipsis"
          placeholder={placeholder}
          {...props}
        />
      </InputGroup>
    </TextField>
  )
}
