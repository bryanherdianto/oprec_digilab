"use server";

import { createClient } from "./supabaseServer";

const ALLOWED_MIME_TYPES = {
	"cv-files": ["application/pdf"],
	"profile-photos": ["image/jpeg", "image/png"],
	transkrip: ["image/jpeg", "image/png"],
};

const MAX_FILE_SIZES = {
	"cv-files": 5 * 1024 * 1024,
	"profile-photos": 2 * 1024 * 1024,
	transkrip: 2 * 1024 * 1024,
};

const RELEVANT_FIELDS = [
	"nama",
	"npm",
	"tanggal_lahir",
	"angkatan",
	"phone",
	"ig_username",
	"line_username",
	"discord_username",
	"cv_url",
	"foto_url",
	"transkrip_url",
	"question_1",
	"question_2",
	"question_3",
	"question_4",
];

export const getCurrentUser = async () => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user },
		} = await supabaseClient.auth.getUser();
		return user;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
};

export const uploadFile = async (file, bucketName, existingUrl) => {
	try {
		if (!ALLOWED_MIME_TYPES[bucketName]) {
			throw new Error(`Unknown bucket: ${bucketName}`);
		}

		if (!ALLOWED_MIME_TYPES[bucketName].includes(file.type)) {
			throw new Error(
				`Invalid file type for ${bucketName}. Allowed: ${ALLOWED_MIME_TYPES[bucketName].join(", ")}`,
			);
		}

		if (file.size > MAX_FILE_SIZES[bucketName]) {
			const maxMB = MAX_FILE_SIZES[bucketName] / (1024 * 1024);
			throw new Error(
				`File size exceeds the ${maxMB}MB limit for ${bucketName}`,
			);
		}

		const supabaseClient = await createClient();
		const {
			data: { user },
		} = await supabaseClient.auth.getUser();

		const fileExt = file.name.split(".").pop();
		const userName =
			user?.user_metadata?.full_name ||
			user?.user_metadata?.display_name ||
			"user";

		const timestamp = Date.now();
		const sanitized = userName.replace(/ /g, "");
		let fileName;
		if (bucketName === "cv-files") {
			fileName = `cv-${sanitized}-${timestamp}.${fileExt}`;
		} else if (bucketName === "profile-photos") {
			fileName = `photo-${sanitized}-${timestamp}.${fileExt}`;
		} else if (bucketName === "transkrip") {
			fileName = `transkrip-${sanitized}-${timestamp}.${fileExt}`;
		}

		if (existingUrl) {
			const oldPath = existingUrl.split("/").pop();
			if (oldPath) {
				await supabaseClient.storage.from(bucketName).remove([oldPath]);
			}
		}

		const filePath = `${fileName}`;

		const { error } = await supabaseClient.storage
			.from(bucketName)
			.upload(filePath, file);

		if (error) {
			console.error(`Error uploading to ${bucketName}:`, error);
			throw new Error(`Failed to upload file: ${error.message}`);
		}

		const { data: urlData } = supabaseClient.storage
			.from(bucketName)
			.getPublicUrl(filePath);

		return urlData.publicUrl;
	} catch (error) {
		console.error(`Error uploading file to ${bucketName}:`, error);
		throw error;
	}
};

export const uploadCV = async (file, existingUrl) => {
	return uploadFile(file, "cv-files", existingUrl);
};

export const uploadPhoto = async (file, existingUrl) => {
	return uploadFile(file, "profile-photos", existingUrl);
};

export const uploadTranskrip = async (file, existingUrl) => {
	return uploadFile(file, "transkrip", existingUrl);
};

export const addPersonalInformation = async (formData) => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const { data, error } = await supabaseClient.from("applicants").upsert([
			{
				id: authUser.id,
				nama: formData.nama,
				npm: formData.npm,
				angkatan: formData.angkatan,
				tanggal_lahir: formData.tanggal_lahir,
			},
		]);
		if (error) {
			console.error("Error adding personal information:", error);
			throw new Error(`Failed to add personal information: ${error.message}`);
		}
		return data;
	} catch (error) {
		console.error("Error adding personal information:", error);
		throw error;
	}
};

export const addContactsFiles = async (formData) => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const { data, error } = await supabaseClient.from("applicants").upsert([
			{
				id: authUser.id,
				phone: formData.phone,
				ig_username: formData.ig_username,
				line_username: formData.line_username,
				discord_username: formData.discord_username,
				cv_url: formData.cv_url,
				foto_url: formData.foto_url,
				transkrip_url: formData.transkrip_url,
			},
		]);
		if (error) {
			console.error("Error adding contacts and files:", error);
			throw new Error(`Failed to add contacts and files: ${error.message}`);
		}
		return data;
	} catch (error) {
		console.error("Error adding contacts and files:", error);
		throw error;
	}
};

export const addEssays = async (formData) => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const { data, error } = await supabaseClient.from("applicants").upsert([
			{
				id: authUser.id,
				question_1: formData.question_1,
				question_2: formData.question_2,
				question_3: formData.question_3,
				question_4: formData.question_4,
			},
		]);
		if (error) {
			console.error("Error adding essays:", error);
			throw new Error(`Failed to add essays: ${error.message}`);
		}
		return data;
	} catch (error) {
		console.error("Error adding essays:", error);
		throw error;
	}
};

export const changeStatus = async (user) => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const userId = authUser.id;

		const { data: applicantData, error: fetchError } = await supabaseClient
			.from("applicants")
			.select("*")
			.eq("id", userId)
			.single();

		if (fetchError) {
			console.error("Error fetching user data:", fetchError);
			throw new Error(`Failed to fetch user data: ${fetchError.message}`);
		}

		if (applicantData.is_submitted === true) {
			throw new Error(
				"Application has already been submitted and cannot be changed.",
			);
		}

		if (user.is_submitted === true) {
			const emptyFields = [];
			for (const field of RELEVANT_FIELDS) {
				const value = applicantData[field];
				if (value === null || value === undefined || value === "") {
					emptyFields.push(field);
				}
			}

			if (emptyFields.length > 0) {
				throw new Error(
					`Cannot submit because the following fields are empty: ${emptyFields.join(", ")}.`,
				);
			}
		}

		const { data, error } = await supabaseClient.from("applicants").upsert([
			{
				id: userId,
				is_submitted: user.is_submitted,
			},
		]);

		if (error) {
			console.error("Error changing status:", error);
			throw new Error(`Failed to change status: ${error.message}`);
		}

		return data;
	} catch (error) {
		console.error("Error changing status:", error);
		throw error;
	}
};

export const getStatus = async () => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const userId = authUser.id;

		const { data, error } = await supabaseClient
			.from("applicants")
			.select("is_submitted")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching status:", error);
			throw new Error(`Failed to fetch status: ${error.message}`);
		}

		return data.is_submitted;
	} catch (error) {
		console.error("Error fetching status:", error);
		throw error;
	}
};

export const getNullLength = async () => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();

		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const userId = authUser.id;

		const { data: applicantData, error: fetchError } = await supabaseClient
			.from("applicants")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (!applicantData && !fetchError) {
			return 0;
		}

		if (fetchError) {
			console.error("Error fetching user data:", fetchError);
			throw new Error(`Failed to fetch user data: ${fetchError.message}`);
		}

		let filledCount = 0;
		for (const field of RELEVANT_FIELDS) {
			const value = applicantData[field];
			if (value !== null && value !== undefined && value !== "") {
				filledCount++;
			}
		}

		return (filledCount / RELEVANT_FIELDS.length) * 100.0;
	} catch (error) {
		console.error("Error calculating progress:", error);
		throw error;
	}
};

export const getUserData = async () => {
	try {
		const supabaseClient = await createClient();
		const {
			data: { user: authUser },
			error: authError,
		} = await supabaseClient.auth.getUser();
		if (authError || !authUser) {
			throw new Error("User is not authenticated.");
		}

		const userId = authUser.id;

		const { data, error } = await supabaseClient
			.from("applicants")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (error) {
			console.error("Error fetching user data:", error);
			throw new Error(`Failed to fetch user data: ${error.message}`);
		}

		if (!data) {
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		throw error;
	}
};
