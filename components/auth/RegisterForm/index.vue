<template>
    <form class="form-card" @submit.prevent="onSubmit">
        <h2 class="form-title">Vous Êtes ?</h2>
        <div class="segmented">
            <button
                type="button"
                class="seg-btn"
                :class="{ active: userType === 'pro' }"
                @click="userType = 'pro'"
            >
                Un Professionnel
            </button>
            <button
                type="button"
                class="seg-btn"
                :class="{ active: userType === 'part' }"
                @click="userType = 'part'"
            >
                Un Particulier
            </button>
        </div>

        <!-- PRO -->
        <template v-if="userType === 'pro'">
            <div class="input-group">
                <label>Nom de société</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-briefcase"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="pro.company"
                        placeholder="Nom de société"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Username</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-briefcase"></i
                    ></InputGroupAddon>
                    <InputText v-model="pro.username" placeholder="Username" />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Email</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-envelope"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="pro.email"
                        placeholder="Email"
                        type="email"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Mot de passe</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-lock"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="pro.password"
                        type="password"
                        placeholder="Mot de passe"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Numéro de SIRET</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-id-card"></i
                    ></InputGroupAddon>
                    <InputNumber
                        v-model="pro.siret"
                        placeholder="Numéro de SIRET"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Numéro de TVA (optionnel)</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-percentage"></i
                    ></InputGroupAddon>
                    <InputNumber
                        v-model="pro.vat"
                        placeholder="Numéro de TVA"
                    />
                </InputGroup>
            </div>
        </template>

        <!-- PARTICULIER -->
        <template v-else>
            <div class="input-group">
                <label>Nom</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-user"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="part.fullname"
                        placeholder="Nom complet"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Prénom</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-user-plus"></i
                    ></InputGroupAddon>
                    <InputText v-model="part.firstname" placeholder="Prénom" />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Email</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-envelope"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="part.email"
                        placeholder="Email"
                        type="email"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Nom d'utilisateur</label>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-desktop"></i>
                    </InputGroupAddon>
                    <InputText
                        v-model="part.username"
                        placeholder="Nom utilisateur"
                    />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Téléphone</label>
                <InputGroup>
                    <InputGroupAddon>
                        <span style="color: black">+33</span>
                    </InputGroupAddon>
                    <InputNumber v-model="part.phoneNumber" />
                </InputGroup>
            </div>

            <div class="input-group">
                <label>Mot de passe</label>
                <InputGroup>
                    <InputGroupAddon
                        ><i class="pi pi-lock"></i
                    ></InputGroupAddon>
                    <InputText
                        v-model="part.password"
                        type="password"
                        placeholder="Mot de passe"
                    />
                </InputGroup>
            </div>
        </template>

        <Button
            class="button"
            :label="
                loading
                    ? userType === 'pro'
                        ? 'S’inscrire en tant que pro…'
                        : 'S’inscrire…'
                    : 'S’inscrire'
            "
            :disabled="loading"
            type="submit"
        />
        <p v-if="localError" class="error">{{ localError }}</p>
        <p v-else-if="externalError" class="error">{{ externalError }}</p>

        <p class="hint">
            Vous avez déjà un compte ?
            <NuxtLink to="/auth/login">Se connecter</NuxtLink>
        </p>
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

type UserType = "pro" | "part";

interface ProForm {
    company: string;
    username: string;
    email: string;
    password: string;
    siret: number | null;
    vat: number | null;
}

interface PartForm {
    fullname: string;
    firstname: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string | number | null;
}

interface RegisterInterface {
    username?: string;
    email?: string;
    password?: string;
    phoneNumber?: string | number | null;
    address_id?: number | null;
    tax_id?: number | null;
    bank_account?: string;
    bank_account_bic?: string;
    image?: string;
    // allow extra fields (company, fullname...) to be sent if needed by backend
    [key: string]: any;
}

const { registerClient, registerSeller } = useAuth();

const userType = ref<UserType>("part");

const pro = ref<ProForm>({
    company: "",
    username: "",
    email: "",
    password: "",
    siret: null,
    vat: null,
});
const part = ref<PartForm>({
    fullname: "",
    firstname: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: null,
});

const loading = ref(false);
const localError = ref("");
const externalError = ref("");

const onSubmit = async () => {
    // reset errors
    localError.value = "";
    externalError.value = "";

    // minimal client-side validation
    if (userType.value === "pro") {
        if (
            !pro.value.company ||
            !pro.value.username ||
            !pro.value.email ||
            !pro.value.password
        ) {
            localError.value =
                "Veuillez renseigner le nom de société, username, email et mot de passe.";
            return;
        }
    } else {
        if (
            !part.value.fullname ||
            !part.value.firstname ||
            !part.value.username ||
            !part.value.email ||
            !part.value.password
        ) {
            localError.value =
                "Veuillez renseigner votre nom, prénom, username, email et mot de passe.";
            return;
        }
    }

    // Build payload expected by backend (RegisterInterface)
    const commonPayload: RegisterInterface = {
        username:
            userType.value === "pro" ? pro.value.username : part.value.username,
        email: userType.value === "pro" ? pro.value.email : part.value.email,
        password:
            userType.value === "pro" ? pro.value.password : part.value.password,
        phoneNumber: userType.value === "pro" ? null : part.value.phoneNumber,
        address_id: null,
    };

    // Add role-specific fields
    if (userType.value === "pro") {
        // Map siret to tax_id (common backend field), include company name
        (commonPayload as any).tax_id = pro.value.siret ?? null;
        (commonPayload as any).company = pro.value.company;
        if (pro.value.vat) (commonPayload as any).vat = pro.value.vat;
    } else {
        // include fullname/firstname for client
        (commonPayload as any).fullname = part.value.fullname;
        (commonPayload as any).firstname = part.value.firstname;
    }

    loading.value = true;
    try {
        let res;
        if (userType.value === "pro") {
            res = await registerSeller(commonPayload);
        } else {
            res = await registerClient(commonPayload);
        }
        // If backend returns an error structure, surface it
        if (!res || (res && (res.error || res.errors))) {
            externalError.value =
                (res && (res.error || JSON.stringify(res.errors))) ||
                "Erreur lors de l'inscription.";
            loading.value = false;
            return;
        }

        // registration successful, navigate to login
        // Nuxt provides a global `navigateTo`
        await navigateTo("/auth/login");
    } catch (err: any) {
        // capture thrown errors (network, unexpected)
        externalError.value =
            (err && (err.message || JSON.stringify(err))) ||
            "Une erreur est survenue lors de l'inscription.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped src="./style.css" />
