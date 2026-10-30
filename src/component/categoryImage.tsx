type Props = {
  image?: string;
  name: string;
};

export default function CategoryImage({
  image,
  name,
}: Props) {
  if (!image) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-green-50 text-4xl">
        🛒
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      className="h-24 w-24 rounded-xl object-cover"
    />
  );
}