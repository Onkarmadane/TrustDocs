import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const AuditForm = () => {

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            auditYear: '',
            registrationNumber: '',
            organizationName: '',
            organizationAddress: '',
            auditorCompany: '',
            auditorEmail: '',
        },
    });

    const onSubmit = async (data) => {

        try {

            setLoading(true);



            const existingPdfBytes = await fetch(
                '/templates/Auditform.pdf'
            ).then((res) => res.arrayBuffer());



            const pdfDoc = await PDFDocument.load(
                existingPdfBytes
            );



            const font = await pdfDoc.embedFont(
                StandardFonts.Helvetica
            );


            const pages = pdfDoc.getPages();

            // FIRST PAGE
            const firstPage = pages[0];


            firstPage.drawText(data.auditYear || '', {
                x: 250,
                y: 530,
                size: 12,
                font,
                color: rgb(0, 0, 0),
            });

            firstPage.drawText(
                data.registrationNumber || '',
                {
                    x: 220,
                    y: 480,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                }
            );

            firstPage.drawText(
                data.organizationName || '',
                {
                    x: 100,
                    y: 430,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                    maxWidth: 400,
                    lineHeight: 14,
                }
            );

            firstPage.drawText(
                data.organizationAddress || '',
                {
                    x: 100,
                    y: 380,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                    maxWidth: 400,
                    lineHeight: 14,
                }
            );

            firstPage.drawText(
                data.auditorCompany || '',
                {
                    x: 80,
                    y: 140,
                    size: 11,
                    font,
                    color: rgb(0, 0, 0),
                }
            );

            firstPage.drawText(
                data.auditorEmail || '',
                {
                    x: 80,
                    y: 120,
                    size: 11,
                    font,
                    color: rgb(0, 0, 0),
                }
            );

            // =========================
            // SAVE PDF
            // =========================

            const pdfBytes = await pdfDoc.save();

            // =========================
            // DOWNLOAD PDF
            // =========================

            const blob = new Blob([pdfBytes], {
                type: 'application/pdf',
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');

            link.href = url;
            link.download = 'audit-report.pdf';

            link.click();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Audit Report Form
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* AUDIT YEAR */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Audit Year
                            </label>

                            <input
                                type="text"
                                placeholder="31.03.2025"
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('auditYear', {
                                    required: 'Audit year is required',
                                })}
                            />

                            {
                                errors.auditYear && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.auditYear.message}
                                    </p>
                                )
                            }

                        </div>

                        {/* REGISTRATION NUMBER */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Registration Number
                            </label>

                            <input
                                type="text"
                                placeholder="F-6825/Jalna"
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('registrationNumber', {
                                    required: 'Registration number is required',
                                })}
                            />

                            {
                                errors.registrationNumber && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.registrationNumber.message}
                                    </p>
                                )
                            }

                        </div>

                        {/* ORGANIZATION NAME */}
                        <div className="md:col-span-2">

                            <label className="block mb-2 font-medium">
                                Organization Name
                            </label>

                            <textarea
                                rows={3}
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('organizationName', {
                                    required: 'Organization name is required',
                                })}
                            />

                            {
                                errors.organizationName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.organizationName.message}
                                    </p>
                                )
                            }

                        </div>

                        {/* ORGANIZATION ADDRESS */}
                        <div className="md:col-span-2">

                            <label className="block mb-2 font-medium">
                                Organization Address
                            </label>

                            <textarea
                                rows={3}
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('organizationAddress')}
                            />

                        </div>

                        {/* AUDITOR COMPANY */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Auditor Company
                            </label>

                            <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('auditorCompany')}
                            />

                        </div>

                        {/* AUDITOR EMAIL */}
                        <div>

                            <label className="block mb-2 font-medium">
                                Auditor Email
                            </label>

                            <input
                                type="email"
                                className="w-full border rounded-lg px-4 py-3"
                                {...register('auditorEmail')}
                            />

                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-4 pt-4">

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-6 py-3 rounded-lg"
                        >
                            {
                                loading
                                    ? 'Generating PDF...'
                                    : 'Generate PDF'
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="border px-6 py-3 rounded-lg"
                        >
                            Reset
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AuditForm;