import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon, Eye, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Products',
        href: '/products',
    },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    featured_image: string;
    featured_image_original_name: string;
    created_at: string;
}

interface ProductPagination {
    data: Product[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface IndexProps {
    products: ProductPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ products, filters, totalCount, filteredCount }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

    console.log(products);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    // Handle Change for the Search Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // To Reset Applied Filter
    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(
            route('products.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Handle Per Page Change
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertDescription className="text-white">
                            {flash.success ? 'Success!' : 'Error!'} {''}
                            {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Search inputs and button */}
                <div className="mb-4 flex w-full items-center justify-between gap-4">
                    <Input
                        type="text"
                        value={data.search}
                        onChange={handleChange}
                        className="h-10 w-1/2"
                        placeholder="Search Product..."
                        name="search"
                    />

                    <Button onClick={handleReset} className="h-10 cursor-pointer bg-red-600 hover:bg-red-500">
                        <X size={20} />
                    </Button>

                    {/* Add product button */}
                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('products.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Add Product
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Name</th>
                                <th className="w-90 border p-4">Description</th>
                                <th className="border p-4">Price (INR)</th>
                                <th className="border p-4">Featured Image</th>
                                <th className="border p-4">Created Date</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.data.length > 0 ? (
                                products.data.map((product, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{products.from + index}</td>
                                        <td className="border px-4 py-2 text-center">{product.name} </td>
                                        <td className="border px-4 py-2 text-center">{product.description} </td>
                                        <td className="border px-4 py-2 text-center">{product.price} </td>
                                        <td className="flex justify-center border px-4 py-2 text-center">
                                            {product.featured_image && (
                                                <img src={product.featured_image} alt={product.name} className="h-16 w-20 rounded-lg object-cover" />
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 text-center">{product.created_at}</td>
                                        <td className="w-40 border px-4 py-2 text-center">
                                            <Link
                                                as="button"
                                                className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                href={route('products.show', product.id)}
                                            >
                                                <Eye size={18} />{' '}
                                            </Link>

                                            <Link
                                                as="button"
                                                className="ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90"
                                                href={route('products.edit', product.id)}
                                            >
                                                <Pencil size={18} />{' '}
                                            </Link>

                                            <Button
                                                className="ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this product?')) {
                                                        router.delete(route('products.destroy', product.id), {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                <Trash2 size={18} />{' '}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-md py-4 text-center font-bold text-red-600">
                                        No Products Found!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination products={products} perPage={data.perPage} onPerPageChange={handlePerPageChange} totalCount={totalCount} filteredCount={filteredCount} search={data.search}  />
            </div>
        </AppLayout>
    );
}
