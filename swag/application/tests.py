"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
import StringIO
from .models import Vacancy
from .models import (GameInstance, Applicationdocumentfiles,MotivationLetter)
from .form import UploadFileForm

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.urlresolvers import reverse
import uuid


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)


class ViewTest(TestCase):

    vacancy_title = "blablahblah"
    vacancy_title2 = "blaat"
    file_content = """
    This is a lot of blah blah! to test the blah blah blah
    """

    vacancy_slug = "slug"
    instance_id = str(uuid.uuid4()).replace('-', '')

    # Hack database storage so during tests this table will be created
    Applicationdocumentfiles._meta.managed = True

    game = GameInstance
    uid = 0

    def setUp(self):
        Vacancy.objects.get_or_create(
            title=self.vacancy_title,
            department="Engineering",
            slug=self.vacancy_slug)

        (self.linked_vacancy, created) = Vacancy.objects.get_or_create(
            title=self.vacancy_title2,
            department="Engineering",
            slug="slug2")

        GameInstance.objects.get_or_create(
            uid=self.instance_id,
            vacancy=self.linked_vacancy)

    def test_index(self):
        response = self.client.get("")

        self.assertContains(response, self.vacancy_title)
        self.assertContains(response, self.vacancy_title2)
        self.assertEqual(response.status_code, 200)

    def test_get_game(self):
        url = reverse("game", kwargs={"slug": self.vacancy_slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

        # Now there should be a game instance.
        vacancy = Vacancy.objects.filter(slug=self.vacancy_slug)[0]
        game, created = GameInstance.objects.get_or_create(
            vacancy=vacancy)

        self.assertEqual(created, False)
        self.assertEqual(game.vacancy, vacancy)

    def test_play(self):
        url = reverse("play", kwargs={"unique_id": 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

        url = reverse("play", kwargs={"unique_id": self.instance_id})
        response = self.client.get(url)

        context = response.context

        self.assertEqual(context['has_motivation_letter'](), False)
        self.assertEqual(context['has_cv'](), False)
        self.assertEqual(type(context['form']), UploadFileForm)
        self.assertEqual(response.status_code, 200)

    def test_contact(self):
        post = {"name": "jerry", "email": "jerry@gmail.com"}
        url = reverse("submitcontact", kwargs={"unique_id": self.instance_id})
        response = self.client.post(url, post)
        game = GameInstance.objects.filter(uid=self.instance_id)[0]
        self.assertEqual(game.player_name, "jerry")
        self.assertEqual(game.player_email, "jerry@gmail.com")

        self.assertEqual(response.status_code, 200)

    def get_temporary_text_file(self):
        io = StringIO.StringIO()
        io.write(self.file_content)
        text_file = InMemoryUploadedFile(io, None, 'foo.txt', 'text', io.len, None)
        text_file.seek(0)
        return text_file

    def test_uploadFile(self):
        url = reverse("submitfile", kwargs={"unique_id": self.instance_id})
        with self.get_temporary_text_file() as file_handle:
            post = {"title": "CVjerry", 'document': file_handle}
            response = self.client.post(url, post)

        self.assertEqual(response.status_code, 200)

    def test_upload_motivation_letter(self):
        game = GameInstance.objects.get(uid=self.instance_id)
        game.player_name = "test"
        game.save()

        url = reverse('submitmotivationfile', kwargs={'unique_id': game.uid})
        title = "blahblah"
        with self.get_temporary_text_file() as fh:
            post = {"title": title, 'document': fh}
            response = self.client.post(url, post)

        self.assertEqual(response.status_code, 200)

        # Now we should have a file in the database
        motivation = MotivationLetter.objects.get(game_instance=game)
        filename = str(motivation.attachment).split('/')[-1:][0]  # Take last element.
        url = reverse('file_show', kwargs={'filename': filename})
        file_contents = self.client.get(url).content
        self.assertEqual(file_contents, self.file_content)
        # test = Applicationdocumentfiles.objects.get(filename=title)

    def test_upload_motivation_entry(self):

        game = GameInstance.objects.get(uid=self.instance_id)
        game.player_name = "test"
        game.save()

        entry = "Kabooom baby"
        url = reverse('submitmotivation', kwargs={'unique_id': game.uid})

        post = {"entry": entry}
        response = self.client.post(url, post)
        self.assertEqual(response.status_code, 200)
        motivation = MotivationLetter.objects.get(game_instance=game)
        self.assertEqual(motivation.entry, entry)

    def test_quest(self):

        game = GameInstance.objects.get(uid=self.instance_id)
        self.assertEqual(game.player_cv_unlockedQuest, False)
        self.assertEqual(game.player_motivation_uplockedQuest, False)
        quest_id = "1"
        post = {"quest_id": quest_id}
        url = reverse('submitquest', kwargs={'unique_id': self.instance_id})
        response = self.client.post(url, post)
        game = GameInstance.objects.get(uid=self.instance_id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(game.player_cv_unlockedQuest, True)
        self.assertEqual(game.player_motivation_uplockedQuest, False)

    def test_gamejs(self):

        url = reverse('init', kwargs={'unique_id': self.instance_id})
        response = self.client.get(url)
        self.assertEqual(response.context['motivation_unlock'], False)
        self.assertEqual(response.context['cv_unlock'], False)
        self.test_quest()
        response = self.client.get(url)
        self.assertEqual(response.context['motivation_unlock'], False)
        self.assertEqual(response.context['cv_unlock'], True)

        self.assertEqual(response.status_code, 200)

    def test_playerdatajs(self):

        url = reverse('playerdata', kwargs={'unique_id': self.instance_id})
        response = self.client.get(url)
        self.assertEqual(response.context['contact_info'], 'no')
        self.test_contact()
        response = self.client.get(url)
        self.assertEqual(response.context['contact_info'], 'yes')
        self.assertEqual(response.status_code, 200)
