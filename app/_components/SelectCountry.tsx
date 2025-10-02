import { getCountries } from "@/app/_lib/data-service";

interface SelectCountryProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  defaultCountry: string;
}

const SelectCountry: React.FC<SelectCountryProps> = async ({
  defaultCountry,
  name,
  id,
  className,
}) => {
  const countries = await getCountries();
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
      key={defaultCountry}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCountry;
